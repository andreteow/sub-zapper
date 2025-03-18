
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CLIENT_ID = "538523165239-pe339he1uo6hi74am26m7a96aa5fea2e.apps.googleusercontent.com";
const CLIENT_SECRET = "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";

// CORS headers to allow requests from any origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
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

async function exchangeCodeForTokens(code: string, redirectUri: string) {
  try {
    console.log("Starting code exchange with redirect URI:", redirectUri);
    
    const tokenRequestBody = new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: redirectUri,
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

// Helper function to decode base64 encoded email content
function decodeBase64(encodedString: string): string {
  // Replace non-standard chars that Gmail uses
  const sanitized = encodedString.replace(/-/g, '+').replace(/_/g, '/');
  try {
    return decodeURIComponent(
      atob(sanitized)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch (error) {
    console.error("Error decoding base64:", error);
    return "Error decoding email content";
  }
}

// Extract the email body from the payload
function extractEmailBody(payload: any): string {
  // Start with an empty body
  let body = '';
  
  // Check for simple body
  if (payload.body && payload.body.data) {
    body = decodeBase64(payload.body.data);
  }
  
  // Check for multipart messages
  if (payload.parts) {
    for (const part of payload.parts) {
      // For text parts, add to body
      if (part.mimeType === 'text/plain' || part.mimeType === 'text/html') {
        if (part.body && part.body.data) {
          body += decodeBase64(part.body.data);
        }
      }
      
      // Handle nested parts (recursively)
      if (part.parts) {
        for (const nestedPart of part.parts) {
          if (nestedPart.mimeType === 'text/plain' || nestedPart.mimeType === 'text/html') {
            if (nestedPart.body && nestedPart.body.data) {
              body += decodeBase64(nestedPart.body.data);
            }
          }
        }
      }
    }
  }
  
  return body;
}

async function fetchEmailDetails(accessToken: string, messageId: string) {
  try {
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
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
    
    // Extract the email body
    const fullBody = extractEmailBody(data.payload);
    
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
      fullBody, // Include full body for better unsubscribe link detection
    };
  } catch (error) {
    console.error(`Error fetching details for email ${messageId}:`, error);
    throw error;
  }
}

async function fetchEmails(accessToken: string, maxResults = 100) {
  try {
    console.log(`Fetching up to ${maxResults} emails with access token`);
    
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Received OPTIONS preflight request");
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }
  
  try {
    console.log("Received request to fetch-gmail function");
    
    // Check for API key
    const apiKey = req.headers.get('apikey') || new URL(req.url).searchParams.get('apikey');
    if (!apiKey) {
      console.error("No API key found in request");
      return new Response(
        JSON.stringify({ 
          error: "No API key found in request", 
          hint: "No `apikey` request header or url param was found." 
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }
    
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
    
    const { authorization, redirectUri, maxResults = 100 } = requestBody || {};
    const { code, tokens } = authorization || {};
    
    // Use the redirectUri from the client if provided, or fall back to a default
    const actualRedirectUri = redirectUri || new URL(req.url).origin + "/auth/callback";
    
    console.log("Auth type:", code ? "authorization code" : tokens ? "tokens" : "none");
    console.log("Using redirect URI:", actualRedirectUri);
    console.log("Max emails to fetch:", maxResults);
    
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
        const tokenResponse = await exchangeCodeForTokens(code, actualRedirectUri);
        
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
        let accessToken = '';
        let resultTokens = null;
        
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
