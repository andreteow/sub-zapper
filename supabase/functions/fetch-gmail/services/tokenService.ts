
// Token-related services
const CLIENT_ID = "538523165239-pe339he1uo6hi74am26m7a96aa5fea2e.apps.googleusercontent.com";
const CLIENT_SECRET = "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";

export async function exchangeCodeForTokens(code: string, redirectUri: string) {
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

export async function refreshAccessToken(refreshToken: string) {
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
