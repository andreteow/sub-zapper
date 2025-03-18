
// Validation helper functions
export function validateRequestBody(req: Request): Promise<any> {
  return req.json().catch(error => {
    console.error("Error parsing request body:", error);
    throw new Error("Invalid request body");
  });
}

export function validateApiKey(req: Request): string {
  const apiKey = req.headers.get('apikey') || new URL(req.url).searchParams.get('apikey');
  if (!apiKey) {
    console.error("No API key found in request");
    throw new Error("No API key found in request");
  }
  return apiKey;
}

export function validateAuthorization(authorization: any): void {
  const { code, tokens } = authorization || {};
  
  if (!code && !tokens) {
    console.error("No authorization code or tokens provided");
    throw new Error("No authorization code or tokens provided");
  }
}
