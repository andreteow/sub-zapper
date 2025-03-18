
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCorsOptions, addCorsHeaders } from "./utils/cors.ts";
import { validateRequestBody, validateApiKey, validateAuthorization } from "./utils/validation.ts";
import { handleAuthorizationCode } from "./handlers/authHandler.ts";
import { handleTokensRequest } from "./handlers/emailHandler.ts";
import { createErrorResponse } from "./handlers/errorHandler.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Received OPTIONS preflight request");
    return handleCorsOptions();
  }
  
  try {
    console.log("Received request to fetch-gmail function");
    
    // Check for API key
    try {
      validateApiKey(req);
    } catch (error) {
      return createErrorResponse(error.message, 401, { 
        hint: "No `apikey` request header or url param was found."
      });
    }
    
    // Parse request body
    let requestBody;
    try {
      requestBody = await validateRequestBody(req);
    } catch (error) {
      return createErrorResponse("Invalid request body", 400);
    }
    
    const { authorization, redirectUri, maxResults = 100 } = requestBody || {};
    
    try {
      validateAuthorization(authorization);
    } catch (error) {
      return createErrorResponse(error.message, 400);
    }
    
    const { code, tokens } = authorization;
    
    // Use the redirectUri from the client if provided, or fall back to a default
    const actualRedirectUri = redirectUri || new URL(req.url).origin + "/auth/callback";
    
    console.log("Auth type:", code ? "authorization code" : tokens ? "tokens" : "none");
    console.log("Using redirect URI:", actualRedirectUri);
    console.log("Max emails to fetch:", maxResults);
    
    // Handle based on authorization type
    if (code) {
      return await handleAuthorizationCode(code, actualRedirectUri);
    } else if (tokens) {
      return await handleTokensRequest(tokens, maxResults);
    }
    
  } catch (error) {
    console.error('Unhandled error in fetch-gmail function:', error);
    return createErrorResponse(
      error.message || 'An unexpected error occurred', 
      500
    );
  }
});
