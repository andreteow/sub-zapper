
import { corsHeaders } from "../utils/cors.ts";

// Create standardized error responses
export function createErrorResponse(message: string, status: number = 400, details: any = null) {
  console.error(`Error: ${message}`, details || '');
  
  return new Response(
    JSON.stringify({ 
      error: message,
      details: details ? (typeof details === 'object' ? JSON.stringify(details) : details) : null
    }),
    {
      status,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    }
  );
}
