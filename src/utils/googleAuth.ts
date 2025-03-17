
import { useToast } from "@/components/ui/use-toast";

// Instead of hardcoding, get the current application URL
const BASE_URL = window.location.origin;
const CLIENT_ID = "538523165239-pe339he1uo6hi74am26m7a96aa5fea2e.apps.googleusercontent.com";
// Use dynamic REDIRECT_URI based on current domain
const REDIRECT_URI = `${BASE_URL}/auth/callback`;
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

export const initiateGoogleAuth = () => {
  // Clear any existing tokens to ensure a fresh authentication
  localStorage.removeItem('gmail_tokens');
  localStorage.removeItem('gmail_connected');

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.append("client_id", CLIENT_ID);
  authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("scope", SCOPES.join(" "));
  authUrl.searchParams.append("access_type", "offline");
  authUrl.searchParams.append("prompt", "consent");

  // For debugging - log the exact redirect URI being used
  console.log("Initiating Google Auth with redirect URI:", REDIRECT_URI);
  
  // Open the Google Auth page
  window.location.href = authUrl.toString();
};

export const useGoogleAuth = () => {
  const { toast } = useToast();
  
  const connectGmail = () => {
    try {
      initiateGoogleAuth();
    } catch (error) {
      console.error("Google Auth Error:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to Gmail. Please try again.",
        variant: "destructive",
      });
    }
  };

  const disconnectGmail = () => {
    try {
      // Remove Gmail tokens from localStorage
      localStorage.removeItem('gmail_tokens');
      localStorage.removeItem('gmail_connected');
      
      toast({
        title: "Gmail Disconnected",
        description: "Your Gmail account has been disconnected.",
      });
      
      // Force a page reload to update the UI
      window.location.reload();
    } catch (error) {
      console.error("Google Disconnect Error:", error);
      toast({
        title: "Disconnection Error",
        description: "Failed to disconnect Gmail. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Add a check to see if Gmail is connected
  const isGmailConnected = () => {
    return localStorage.getItem('gmail_connected') === 'true';
  };

  return { connectGmail, disconnectGmail, isGmailConnected };
};
