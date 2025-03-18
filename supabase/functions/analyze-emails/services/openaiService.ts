
import { EmailHeader, Subscription } from "../types/email.ts";

/**
 * Analyze a batch of emails using OpenAI
 */
export async function analyzeEmailBatch(emails: EmailHeader[]): Promise<Subscription[]> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }
  
  try {
    const emailSummaries = emails.map(email => {
      // Extract List-Unsubscribe headers and include in the analysis
      return {
        subject: email.subject,
        from: email.from,
        snippet: email.snippet,
        date: email.date,
        // Include unsubscribe URL from headers if available
        unsubscribeUrl: email.unsubscribeUrl,
        // Include any available full body content
        fullBody: email.fullBody || undefined
      };
    });
    
    const { systemPrompt, userPrompt } = createPrompts(emailSummaries);
    
    console.log('Sending request to OpenAI...');
    
    const response = await callOpenAIAPI(openAIApiKey, systemPrompt, userPrompt);
    console.log('Received response from OpenAI');
    
    return parseOpenAIResponse(response, emails);
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    // Provide more detailed error information
    if (error.response) {
      console.error('OpenAI API error status:', error.response.status);
      console.error('OpenAI API error details:', await error.response.text());
    }
    throw new Error(`OpenAI API error: ${error.message}`);
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
  - unsubscribeUrl: URL to unsubscribe if mentioned in the email (CRITICAL TO FIND)
  
  MOST IMPORTANT TASK - Find unsubscribe links, in this exact priority order:
  1. CHECK THE unsubscribeUrl field first - this is a direct link extracted from email headers like List-Unsubscribe and is the most reliable
  2. Look for Gmail-specific headers like "List-Unsubscribe" or "List-Unsubscribe-Post" 
  3. If no unsubscribeUrl in the data, ALWAYS look at the bottom/footer of each email's fullBody
  4. Look for text like "unsubscribe", "opt-out", "manage preferences", "email preferences", etc.
  5. Look for text containing "click here to unsubscribe" or similar phrases
  6. Extract the FULL URL from the href attribute when you find these links
  7. The link often appears after phrases like "You're receiving this because you've subscribed" or similar text
  8. These links are often displayed in small text at the very bottom of the email
  9. If you find multiple options, prefer direct unsubscribe links over preference management links
  10. If the unsubscribe link is missing, look for mailto: links with subject lines containing unsubscribe
  
  Only include subscriptions where you're confident there's an actual subscription, service or newsletter. Return your analysis as a valid JSON array, with each item representing a single subscription. Do not include any explanations, additional text or notes outside of the JSON structure.`;
  
  const userPrompt = `Here are ${emailSummaries.length} emails to analyze for potential subscriptions, newsletters or paid services. Pay special attention to finding unsubscribe links in the email headers and footers: ${JSON.stringify(emailSummaries)}`;
  
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
      temperature: 0.1, // Lower temperature for more deterministic results
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
  try {
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
  } catch (error) {
    console.error('Error processing OpenAI response:', error);
    return [];
  }
}

/**
 * Validate and enhance subscriptions with IDs and detected date
 */
function validateAndEnhanceSubscriptions(subscriptions: any[], detectedDate: string): Subscription[] {
  if (!Array.isArray(subscriptions)) {
    console.error('Invalid subscriptions data (not an array):', subscriptions);
    return [];
  }
  
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
