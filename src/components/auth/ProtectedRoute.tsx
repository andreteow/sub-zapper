
import { ReactNode, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, isLoaded, navigate]);

  if (!isLoaded) {
    // You could return a loading spinner here
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return isSignedIn ? <>{children}</> : null;
};

export default ProtectedRoute;
