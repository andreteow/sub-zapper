
import React from "react";
import { useNavigate } from "react-router-dom";
import { SignUpButton, useAuth } from "@clerk/clerk-react";
import { Zap, Shield, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Waitlist = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isSignedIn) {
      navigate("/dashboard");
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">Sub-Zapper</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate("/")} variant="ghost">
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Waitlist Content */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Join the <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">Waitlist</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
              Be the first to know when we launch. Sign up below to get early access to Sub-Zapper.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <div className="flex justify-center mb-8">
              <div className="bg-blue-100 p-4 rounded-full">
                <Mail className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-bold">Get Early Access</h2>
              <p className="text-muted-foreground">
                We're currently in private beta. Join our waitlist and you'll be one of the first to try Sub-Zapper.
              </p>
              
              <div className="flex justify-center pt-4">
                <SignUpButton mode="modal">
                  <Button size="lg" className="bg-blue-500 hover:bg-blue-600 px-8 py-6 text-lg">
                    Sign Up for Early Access
                  </Button>
                </SignUpButton>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid gap-8 md:grid-cols-3 mt-16">
            <div className="rounded-lg border bg-card p-6 shadow-sm text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Zap className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="mb-2 text-lg font-medium">Early Access</h3>
              <p className="text-muted-foreground">Get access to features before they're publicly released</p>
            </div>
            
            <div className="rounded-lg border bg-card p-6 shadow-sm text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-100">
                <Shield className="h-6 w-6 text-pink-500" />
              </div>
              <h3 className="mb-2 text-lg font-medium">Priority Support</h3>
              <p className="text-muted-foreground">Direct access to our team for help and feedback</p>
            </div>
            
            <div className="rounded-lg border bg-card p-6 shadow-sm text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Mail className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="mb-2 text-lg font-medium">Exclusive Updates</h3>
              <p className="text-muted-foreground">Be the first to know about new features and improvements</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 mt-10">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-semibold text-primary">Sub-Zapper</span>
          </div>
          <p className="mt-4">© 2024 Sub-Zapper. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Waitlist;
