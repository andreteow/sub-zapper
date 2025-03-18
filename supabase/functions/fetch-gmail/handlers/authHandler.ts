
import { exchangeCodeForTokens } from "../services/tokenService.ts";
import { corsHeaders } from "../utils/cors.ts";

// Handle authorization code exchange
export async function handleAuthorizationCode(code: string, redirectUri: string) {
  try {
    // Exchange authorization code for tokens
    console.log("Exchanging authorization code for tokens");
    const tokenResponse = await exchangeCodeForTokens(code, redirectUri);
    
    // Return tokens only without trying to fetch emails yet
    // This simplifies the flow and helps isolate potential issues
    return new Response(JSON.stringify({ 
      tokens: {
        access_token: tokenResponse.access_token,
        refresh_token: tokenResponse.refresh_token,
        expires_in: tokenResponse.expires_in
      }
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    console.error("Error exchanging authorization code:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Authorization failed",
        details: typeof error === 'object' ? JSON.stringify(error) : null
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
}
