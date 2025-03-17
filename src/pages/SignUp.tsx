
import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <SignUp
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

export default SignUpPage;
