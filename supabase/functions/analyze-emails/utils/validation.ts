
import { corsHeaders } from "./cors.ts";

/**
 * Validates the email input data
 */
export function validateEmailInput(emails: any): boolean {
  return emails && Array.isArray(emails) && emails.length > 0;
}

/**
 * Creates an error response with the specified message and status code
 */
export function createErrorResponse(message: string, status: number): Response {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}
