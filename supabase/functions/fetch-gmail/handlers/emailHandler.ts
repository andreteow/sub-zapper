
import { refreshAccessToken } from "../services/tokenService.ts";
import { fetchEmails } from "../services/emailService.ts";
import { corsHeaders } from "../utils/cors.ts";

// Handle token-based email fetching
export async function handleTokensRequest(tokens: any, maxResults: number) {
  try {
    let accessToken = '';
    let resultTokens = null;
    
    if (tokens.refresh_token) {
      // Refresh the access token if needed
      const tokenResponse = await refreshAccessToken(tokens.refresh_token);
      accessToken = tokenResponse.access_token;
      resultTokens = {
        access_token: tokenResponse.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: tokenResponse.expires_in
      };
    } else {
      accessToken = tokens.access_token;
    }
    
    const emails = await fetchEmails(accessToken, maxResults);
    return new Response(JSON.stringify({ 
      emails,
      tokens: resultTokens
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    console.error("Error using or refreshing tokens:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to use or refresh tokens" }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
}
