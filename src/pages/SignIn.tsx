
import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-md",
            card: "shadow-lg border rounded-lg p-6"
          }
        }}
      />
    </div>
  );
};

export default SignInPage;
