
import React from "react";
import { useNavigate } from "react-router-dom";
import { SignInButton, SignUpButton, useAuth } from "@clerk/clerk-react";
import { Zap, Shield, Calendar, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Landing = () => {
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
            <SignInButton mode="modal">
              <Button variant="ghost">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button>Get Started</Button>
            </SignUpButton>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Take Control of Your
          <span className="text-primary"> Subscriptions</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
          Track, manage, and cancel unwanted subscriptions in one place. Save money
          and reduce digital clutter.
        </p>
        <SignUpButton mode="modal">
          <Button size="lg" className="px-8 py-6 text-lg">
            Start Managing Subscriptions
          </Button>
        </SignUpButton>
      </section>

      {/* Features */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">How Sub-Zapper Helps You</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Mail className="h-10 w-10 text-primary" />}
              title="Email Subscription Tracking"
              description="Connect your email to automatically discover all your subscriptions in minutes."
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-primary" />}
              title="One-Click Cancellations"
              description="Easily cancel unwanted subscriptions and unsubscribe from newsletters with one click."
            />
            <FeatureCard
              icon={<Calendar className="h-10 w-10 text-primary" />}
              title="Renewal Reminders"
              description="Get notified before you're charged for renewals so you never pay for services you don't use."
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="mb-6 text-3xl font-bold">Ready to save money and reduce digital clutter?</h2>
        <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
          Join thousands of users who have taken control of their subscriptions.
        </p>
        <SignUpButton mode="modal">
          <Button size="lg" className="px-8 py-6 text-lg">
            Get Started — It's Free
          </Button>
        </SignUpButton>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
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

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="rounded-lg border bg-card p-6 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Landing;
