
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
  unsubscribeUrl?: string;
  detectedDate: string;
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
  fullBody?: string;  // Add this to store the full email body if available
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
    
    if (!validateEmailInput(emails)) {
      return createErrorResponse("No emails provided for analysis", 400);
    }
    
    console.log(`Analyzing ${emails.length} emails for subscriptions...`);
    
    const subscriptions = await processEmails(emails);
    
    return new Response(
      JSON.stringify({ 
        subscriptions,
        analyzedCount: emails.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in analyze-emails function:', error);
    return createErrorResponse(error.message || 'An error occurred during email analysis', 500);
  }
});

/**
 * Validates the email input data
 */
function validateEmailInput(emails: any): boolean {
  return emails && Array.isArray(emails) && emails.length > 0;
}

/**
 * Creates an error response with the specified message and status code
 */
function createErrorResponse(message: string, status: number): Response {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

/**
 * Process emails in batches and return unique subscriptions
 */
async function processEmails(emails: EmailHeader[]): Promise<Subscription[]> {
  // Analyze emails in smaller batches to avoid token limits
  const batchSize = 10;
  let allSubscriptions: Subscription[] = [];
  
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i/batchSize) + 1}, with ${batch.length} emails`);
    
    const batchSubscriptions = await analyzeEmailBatch(batch);
    if (batchSubscriptions.length > 0) {
      console.log(`Found ${batchSubscriptions.length} subscriptions in batch ${Math.floor(i/batchSize) + 1}`);
      allSubscriptions = [...allSubscriptions, ...batchSubscriptions];
    }
  }
  
  // Remove duplicate subscriptions based on name and email
  const uniqueSubscriptions = removeDuplicateSubscriptions(allSubscriptions);
  
  logSubscriptionResults(uniqueSubscriptions);
  
  return uniqueSubscriptions;
}

/**
 * Remove duplicate subscriptions based on name and email
 */
function removeDuplicateSubscriptions(subscriptions: Subscription[]): Subscription[] {
  const uniqueMap = new Map();
  
  subscriptions.forEach(subscription => {
    // Create a unique key based on name and email (if available)
    const key = `${subscription.name.toLowerCase()}_${subscription.email || ''}`;
    
    // If this key doesn't exist yet or if the current subscription has more information, update the map
    if (!uniqueMap.has(key) || hasMoreInformation(subscription, uniqueMap.get(key))) {
      uniqueMap.set(key, subscription);
    }
  });
  
  return Array.from(uniqueMap.values());
}

/**
 * Check if a subscription has more information than another
 */
function hasMoreInformation(a: Subscription, b: Subscription): boolean {
  let aScore = 0;
  let bScore = 0;
  
  // Score based on available fields
  if (a.price) aScore += 1;
  if (a.renewalDate) aScore += 1;
  if (a.unsubscribeUrl) aScore += 1;
  if (a.managementUrl) aScore += 1;
  
  if (b.price) bScore += 1;
  if (b.renewalDate) bScore += 1;
  if (b.unsubscribeUrl) bScore += 1;
  if (b.managementUrl) bScore += 1;
  
  return aScore > bScore;
}

/**
 * Log subscription results for debugging
 */
function logSubscriptionResults(subscriptions: Subscription[]): void {
  console.log(`Found ${subscriptions.length} unique subscriptions`);
  console.log("Subscription types breakdown:", 
    subscriptions.reduce((counts, sub) => {
      counts[sub.type] = (counts[sub.type] || 0) + 1;
      return counts;
    }, {} as Record<string, number>)
  );
}

/**
 * Analyze a batch of emails using OpenAI
 */
async function analyzeEmailBatch(emails: EmailHeader[]): Promise<Subscription[]> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }
  
  const emailSummaries = emails.map(email => ({
    subject: email.subject,
    from: email.from,
    snippet: email.snippet,
    date: email.date,
    // Include any available full body content
    fullBody: email.fullBody || undefined
  }));
  
  const { systemPrompt, userPrompt } = createPrompts(emailSummaries);
  
  console.log('Sending request to OpenAI...');
  
  try {
    const response = await callOpenAIAPI(openAIApiKey, systemPrompt, userPrompt);
    console.log('Received response from OpenAI');
    
    return parseOpenAIResponse(response, emails);
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}

/**
 * Create the system and user prompts for OpenAI, with improved instructions for unsubscribe links
 */
function createPrompts(emailSummaries: any[]): { systemPrompt: string, userPrompt: string } {
  const systemPrompt = `You are a subscription detection system. Analyze the provided emails and extract any information about subscriptions, newsletters, or paid services. For each detected subscription, output:
  
  - name: Company or service name
  - type: "paid", "free" or "newsletter" 
  - price: Monthly price (if available, number only without currency symbol)
  - renewalDate: When it needs to be renewed (if available, in YYYY-MM-DD format)
  - email: The email address associated with the subscription (if available)
  - unsubscribeUrl: URL to unsubscribe if mentioned in the email (VERY IMPORTANT)
  
  Pay special attention to finding unsubscribe links:
  1. Look at the bottom/footer of the email - that's where unsubscribe links are typically located
  2. Look for text like "unsubscribe", "opt-out", "manage preferences", "email preferences", etc.
  3. Extract the full URL, not just the text
  4. If you find multiple options, prefer direct unsubscribe links over preference management links
  
  Only include subscriptions where you're confident there's an actual subscription, service or newsletter. Return your analysis as a valid JSON array, with each item representing a single subscription. Do not include any explanations, additional text or notes outside of the JSON structure.`;
  
  const userPrompt = `Here are ${emailSummaries.length} emails to analyze for potential subscriptions, newsletters or paid services: ${JSON.stringify(emailSummaries)}`;
  
  return { systemPrompt, userPrompt };
}

/**
 * Call the OpenAI API with the provided prompts
 */
async function callOpenAIAPI(apiKey: string, systemPrompt: string, userPrompt: string): Promise<any> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
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
  
  return await response.json();
}

/**
 * Parse the OpenAI response and extract subscription data
 */
function parseOpenAIResponse(data: any, emails: EmailHeader[]): Subscription[] {
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
      
      // Validate the structure and add IDs and detected date
      const today = new Date().toISOString().split('T')[0];
      const validSubscriptions = validateAndEnhanceSubscriptions(parsedSubscriptions, today);
      
      console.log(`Found ${validSubscriptions.length} subscriptions in batch`);
      
      // Log each detected subscription for debugging
      validSubscriptions.forEach((sub, index) => {
        console.log(`Subscription ${index + 1}: ${sub.name} (${sub.type})${sub.price ? ' - $' + sub.price : ''}`);
        if (sub.unsubscribeUrl) {
          console.log(`  - Unsubscribe URL: ${sub.unsubscribeUrl}`);
        }
      });
      
      return validSubscriptions;
    } else {
      console.warn('Response is not a valid JSON array', jsonText);
      return [];
    }
  } catch (error) {
    console.error('Error parsing subscription data:', error, content);
    return [];
  }
}

/**
 * Validate and enhance subscriptions with IDs and detected date
 */
function validateAndEnhanceSubscriptions(subscriptions: any[], detectedDate: string): Subscription[] {
  return subscriptions
    .filter(sub => sub && typeof sub === 'object' && sub.name)
    .map((sub: any) => ({
      id: crypto.randomUUID(),
      name: sub.name,
      type: ['paid', 'free', 'newsletter'].includes(sub.type) ? sub.type : 'free',
      price: sub.price ? parseFloat(sub.price) : undefined,
      renewalDate: sub.renewalDate,
      email: sub.email,
      unsubscribeUrl: sub.unsubscribeUrl,
      detectedDate: detectedDate, // Add the detection date
    }));
}
