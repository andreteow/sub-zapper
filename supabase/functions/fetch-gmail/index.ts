import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CLIENT_ID = "538523165239-pe339he1uo6hi74am26m7a96aa5fea2e.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
// Make sure the redirect URI matches exactly what's configured in Google Cloud Console
const REDIRECT_URI = "http://localhost:5173/auth/callback";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: {
    headers: {
      name: string;
      value: string;
    }[];
    body: {
      data?: string;
    };
    parts?: {
      mimeType: string;
      body: {
        data?: string;
      };
    }[];
  };
  sizeEstimate: number;
  historyId: string;
  internalDate: string;
}

async function exchangeCodeForTokens(code: string) {
  try {
    console.log("Starting code exchange with redirect URI:", REDIRECT_URI);
    
    const tokenRequestBody = new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }).toString();
    
    console.log("Token request body prepared (without exposing sensitive data)");
    
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenRequestBody,
    });

    const responseText = await response.text();
    console.log(`Token exchange response status: ${response.status}`);
    
    if (!response.ok) {
      console.error(`Token exchange failed with status: ${response.status}`);
      console.error(`Response body: ${responseText}`);
      throw new Error(`Failed to exchange code for tokens: ${response.status} ${responseText}`);
    }
    
    try {
      const data = JSON.parse(responseText);
      console.log("Token exchange successful");
      return data;
    } catch (e) {
      console.error("Failed to parse token response JSON:", e);
      console.error("Response was:", responseText);
      throw new Error("Failed to parse token response");
    }
  } catch (error) {
    console.error("Error in exchangeCodeForTokens:", error);
    throw error;
  }
}

async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to refresh token:', response.status, errorText);
      throw new Error(`Failed to refresh access token: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("Token refresh successful");
    return data;
  } catch (error) {
    console.error("Error in refreshAccessToken:", error);
    throw error;
  }
}

async function fetchEmails(accessToken: string, maxResults = 10) {
  try {
    console.log("Fetching emails with access token");
    
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch emails:', response.status, errorText);
      throw new Error(`Failed to fetch email list: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const emails = [];

    // Fetch details for each email
    for (const message of data.messages || []) {
      try {
        const messageDetails = await fetchEmailDetails(accessToken, message.id);
        emails.push(messageDetails);
      } catch (error) {
        console.error(`Error fetching details for email ${message.id}:`, error);
        // Continue with other emails even if one fails
      }
    }

    return emails;
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
}

async function fetchEmailDetails(accessToken: string, messageId: string) {
  try {
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch email details for ID ${messageId}:`, response.status, errorText);
      throw new Error(`Failed to fetch email details: ${response.status} ${errorText}`);
    }

    const data: EmailMessage = await response.json();
    
    // Extract relevant email information
    const headers = data.payload.headers;
    const subject = headers.find(h => h.name.toLowerCase() === 'subject')?.value || 'No Subject';
    const from = headers.find(h => h.name.toLowerCase() === 'from')?.value || 'Unknown Sender';
    const date = headers.find(h => h.name.toLowerCase() === 'date')?.value || '';
    const to = headers.find(h => h.name.toLowerCase() === 'to')?.value || '';
    
    return {
      id: data.id,
      threadId: data.threadId,
      snippet: data.snippet,
      subject,
      from,
      to,
      date,
      labelIds: data.labelIds,
      sizeEstimate: data.sizeEstimate,
      internalDate: data.internalDate,
    };
  } catch (error) {
    console.error(`Error fetching details for email ${messageId}:`, error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log("Received request to fetch-gmail function");
    
    let requestBody;
    try {
      requestBody = await req.json();
      console.log("Request body parsed successfully");
    } catch (error) {
      console.error("Error parsing request body:", error);
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }
    
    const { authorization } = requestBody || {};
    const { code, tokens } = authorization || {};

    console.log("Auth type:", code ? "authorization code" : tokens ? "tokens" : "none");
    
    if (!code && !tokens) {
      console.error("No authorization code or tokens provided");
      return new Response(
        JSON.stringify({ error: "No authorization code or tokens provided" }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }
    
    try {
      if (code) {
        // Exchange authorization code for tokens
        console.log("Exchanging authorization code for tokens");
        const tokenResponse = await exchangeCodeForTokens(code);
        
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
      } else if (tokens) {
        // Use provided tokens
        try {
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
          
          const emails = await fetchEmails(accessToken);
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
    } catch (error) {
      console.error("Error processing authorization:", error);
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
  } catch (error) {
    console.error('Unhandled error in fetch-gmail function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: typeof error === 'object' ? JSON.stringify(error) : null
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
