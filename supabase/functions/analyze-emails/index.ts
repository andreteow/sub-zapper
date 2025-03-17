
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Define types directly in the edge function instead of importing them
type SubscriptionType = 'paid' | 'free' | 'newsletter';

interface Subscription {
  id: string;
  name: string;
  type: SubscriptionType;
  price?: number;
  renewalDate?: string;
  logo?: string;
  managementUrl?: string;
  lastCharge?: string;
  email?: string;
}

// Define email interface
interface EmailHeader {
  id: string;
  threadId: string;
  snippet: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  labelIds: string[];
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { emails } = await req.json();
    
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return new Response(
        JSON.stringify({ error: "No emails provided for analysis" }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    console.log(`Analyzing ${emails.length} emails for subscriptions...`);
    
    // Analyze emails in smaller batches to avoid token limits
    const batchSize = 5;
    let allSubscriptions: Subscription[] = [];
    
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      console.log(`Processing batch ${i/batchSize + 1}, with ${batch.length} emails`);
      
      const batchSubscriptions = await analyzeEmailBatch(batch);
      if (batchSubscriptions.length > 0) {
        allSubscriptions = [...allSubscriptions, ...batchSubscriptions];
      }
    }
    
    // Remove duplicate subscriptions based on name
    const uniqueSubscriptions = allSubscriptions.reduce((acc, subscription) => {
      const existingIndex = acc.findIndex(s => s.name.toLowerCase() === subscription.name.toLowerCase());
      if (existingIndex === -1) {
        acc.push(subscription);
      } else {
        // Merge information if needed
        if (subscription.price && !acc[existingIndex].price) {
          acc[existingIndex].price = subscription.price;
        }
        if (subscription.renewalDate && !acc[existingIndex].renewalDate) {
          acc[existingIndex].renewalDate = subscription.renewalDate;
        }
      }
      return acc;
    }, [] as Subscription[]);
    
    console.log(`Found ${uniqueSubscriptions.length} unique subscriptions`);
    
    return new Response(
      JSON.stringify({ 
        subscriptions: uniqueSubscriptions,
        analyzedCount: emails.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in analyze-emails function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred during email analysis' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function analyzeEmailBatch(emails: EmailHeader[]): Promise<Subscription[]> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }
  
  const emailSummaries = emails.map(email => {
    return {
      subject: email.subject,
      from: email.from,
      snippet: email.snippet,
      date: email.date
    };
  });
  
  // Prepare the prompt for GPT-4o
  const systemPrompt = `You are a subscription detection system. Analyze the provided emails and extract any information about subscriptions, newsletters, or paid services. For each detected subscription, output: 
  - name: Company or service name
  - type: "paid", "free" or "newsletter" 
  - price: Monthly price (if available, number only without currency symbol)
  - renewalDate: When it needs to be renewed (if available, in YYYY-MM-DD format)
  - email: The email address associated with the subscription (if available)
  
  Only include subscriptions where you're confident there's an actual subscription, service or newsletter. Return your analysis as a valid JSON array, with each item representing a single subscription. Do not include any explanations, additional text or notes outside of the JSON structure.`;
  
  const userPrompt = `Here are ${emails.length} emails to analyze for potential subscriptions, newsletters or paid services: ${JSON.stringify(emailSummaries)}`;
  
  console.log('Sending request to OpenAI...');
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} ${errorData}`);
    }
    
    const data = await response.json();
    console.log('Received response from OpenAI');
    
    // Extract the generated content
    const content = data.choices[0].message.content.trim();
    
    // Parse the JSON from the response
    try {
      // Sometimes GPT includes markdown code blocks, so we handle that too
      let jsonText = content;
      if (content.includes('```')) {
        jsonText = content.split('```json')[1]?.split('```')[0] || 
                  content.split('```')[1]?.split('```')[0] || 
                  content;
      }
      
      // Clean up any potential extra text before or after JSON
      jsonText = jsonText.trim();
      if (jsonText.startsWith('[') && jsonText.endsWith(']')) {
        const parsedSubscriptions = JSON.parse(jsonText);
        
        // Validate the structure and add IDs
        const validSubscriptions = parsedSubscriptions
          .filter(sub => sub && typeof sub === 'object' && sub.name)
          .map((sub: any) => ({
            id: crypto.randomUUID(),
            name: sub.name,
            type: ['paid', 'free', 'newsletter'].includes(sub.type) ? sub.type : 'free',
            price: sub.price ? parseFloat(sub.price) : undefined,
            renewalDate: sub.renewalDate,
            email: sub.email,
          }));
        
        console.log(`Found ${validSubscriptions.length} subscriptions in batch`);
        return validSubscriptions;
      } else {
        console.warn('Response is not a valid JSON array', jsonText);
        return [];
      }
    } catch (error) {
      console.error('Error parsing subscription data:', error, content);
      return [];
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}
