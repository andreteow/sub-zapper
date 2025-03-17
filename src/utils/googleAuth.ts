
import { useToast } from "@/components/ui/use-toast";

const CLIENT_ID = "538523165239-pe339he1uo6hi74am26m7a96aa5fea2e.apps.googleusercontent.com";
const REDIRECT_URI = `${window.location.origin}/auth/callback`;
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

export const initiateGoogleAuth = () => {
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.append("client_id", CLIENT_ID);
  authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("scope", SCOPES.join(" "));
  authUrl.searchParams.append("access_type", "offline");
  authUrl.searchParams.append("prompt", "consent");

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

  return { connectGmail };
};
