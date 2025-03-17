
import React from "react";
import { useNavigate } from "react-router-dom";
import { SignInButton, useAuth } from "@clerk/clerk-react";
import { Zap, Shield, Calendar, Mail, ArrowRight, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isSignedIn) {
      navigate("/dashboard");
    }
  }, [isSignedIn, navigate]);

  const goToWaitlist = () => {
    navigate("/waitlist");
  };

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
              <Button variant="ghost">Login</Button>
            </SignInButton>
            <Button onClick={goToWaitlist} className="bg-blue-500 hover:bg-blue-600">
              Sign Up Free
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Take control of your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">subscriptions</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
            Never forget what you're subscribed to. Get instant insights, easy unsubscribe options, and renewal reminders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={goToWaitlist} 
              size="lg" 
              className="bg-blue-500 hover:bg-blue-600 px-6"
            >
              Try for free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              How It Works
            </Button>
          </div>
        </div>
        
        {/* Mockup image */}
        <div className="mt-16 relative max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8 relative">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-blue-500 mb-10">Sub-Zapper Dashboard</h2>
              <div className="h-40 flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-500">Dashboard Preview</p>
              </div>
            </div>
            
            {/* Sample subscription alerts */}
            <div className="absolute -right-4 -top-4 bg-white p-3 rounded-lg shadow-md border flex items-center gap-2">
              <div className="bg-green-100 p-1 rounded-full">
                <Zap className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Netflix unsubscribed</p>
                <p className="text-xs text-gray-500">Saved $11.99/month</p>
              </div>
            </div>
            
            <div className="absolute -left-4 bottom-10 bg-white p-3 rounded-lg shadow-md border flex items-center gap-2">
              <div className="bg-yellow-100 p-1 rounded-full">
                <BellRing className="h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Spotify renews in 3 days</p>
                <p className="text-xs text-gray-500">$9.99 will be charged</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">How Sub-Zapper works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Mail className="h-10 w-10 text-blue-500" />}
              title="Scan your inbox"
              description="Connect your email and we'll automatically find all your subscriptions, newsletters, and services."
              iconBg="bg-blue-100"
            />
            <FeatureCard
              icon={<Calendar className="h-10 w-10 text-pink-500" />}
              title="Track & cancel subscriptions"
              description="See all your subscriptions in one place. Cancel unwanted services and unsubscribe from emails with one click."
              iconBg="bg-pink-100"
            />
            <FeatureCard
              icon={<BellRing className="h-10 w-10 text-yellow-500" />}
              title="Get renewal reminders"
              description="Never be surprised by charges again. Get notified before your subscriptions renew."
              iconBg="bg-yellow-100"
            />
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="mb-6 flex justify-center">
            <div className="bg-blue-100 p-4 rounded-full">
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <h2 className="mb-6 text-3xl font-bold">Your privacy is our priority</h2>
          <p className="mb-8 text-muted-foreground">
            We never store your email password. Your data is encrypted and you can delete it anytime.
          </p>
          <Button variant="outline">Learn about our privacy policy</Button>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">Ready to take control of your subscriptions?</h2>
          <p className="mx-auto mb-10 max-w-2xl text-xl opacity-90">
            Join thousands of users who have saved money and reduced email clutter.
          </p>
          <Button 
            onClick={goToWaitlist} 
            size="lg" 
            variant="secondary" 
            className="px-8 py-6 text-lg bg-white text-blue-600 hover:bg-gray-100"
          >
            Get Started For Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-semibold text-primary">Sub-Zapper</span>
          </div>
          <p className="mt-4">© 2024 Sub-Zapper. All rights reserved.</p>
          <div className="mt-4 flex justify-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">Terms</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBg: string;
}

const FeatureCard = ({ icon, title, description, iconBg }: FeatureCardProps) => {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${iconBg}`}>
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-center">{title}</h3>
      <p className="text-muted-foreground text-center">{description}</p>
    </div>
  );
};

export default Landing;
