
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { validateEmailInput, createErrorResponse } from "./utils/validation.ts";
import { processEmails } from "./services/emailProcessor.ts";
import { corsHeaders } from "./utils/cors.ts";

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
    
    try {
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
      console.error('Error processing emails:', error);
      return createErrorResponse(`Error processing emails: ${error.message}`, 500);
    }
  } catch (error: any) {
    console.error('Error in analyze-emails function:', error);
    return createErrorResponse(error.message || 'An error occurred during email analysis', 500);
  }
});
