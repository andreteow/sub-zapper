
import React from "react";
import { useNavigate } from "react-router-dom";
import { SignInButton, useAuth } from "@clerk/clerk-react";
import { Zap, Shield, Calendar, Mail, ArrowRight, BellRing, CreditCard, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { subscriptions } from "@/data/mockData";

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
        
        {/* Dashboard Carousel Preview */}
        <div className="mt-16 relative max-w-5xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {/* Dashboard Overview Preview */}
              <CarouselItem>
                <div className="p-1">
                  <Card className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="mb-4 flex justify-between items-center">
                        <h3 className="text-2xl font-bold text-blue-500">Dashboard Overview</h3>
                        <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="bg-white rounded-lg border p-4 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-sm font-medium">Monthly Spending</p>
                              <p className="text-xs text-gray-500">Your subscription costs</p>
                            </div>
                            <CreditCard className="h-4 w-4 text-blue-500" />
                          </div>
                          <p className="text-2xl font-bold text-blue-500">$105.54</p>
                          <p className="text-xs text-gray-500">Across 6 paid subscriptions</p>
                        </div>
                        
                        <div className="bg-white rounded-lg border p-4 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-medium">Subscription Types</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-sm bg-blue-500"></div>
                                <span className="text-xs">Paid</span>
                              </div>
                              <span className="text-xs font-medium">6</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-gray-100">
                              <div className="h-2 w-[50%] rounded-full bg-blue-500"></div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-sm bg-green-500"></div>
                                <span className="text-xs">Free</span>
                              </div>
                              <span className="text-xs font-medium">2</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-gray-100">
                              <div className="h-2 w-[17%] rounded-full bg-green-500"></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg border p-4 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-sm font-medium">Upcoming Renewals</p>
                              <p className="text-xs text-gray-500">Next 7 days</p>
                            </div>
                            <Calendar className="h-4 w-4 text-yellow-500" />
                          </div>
                          <div className="flex items-center justify-center h-[84px]">
                            <p className="text-xs text-gray-500">No upcoming renewals</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
              
              {/* Subscriptions List Preview */}
              <CarouselItem>
                <div className="p-1">
                  <Card className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="mb-4 flex justify-between items-center">
                        <h3 className="text-2xl font-bold text-blue-500">Your Subscriptions</h3>
                        <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                      </div>
                      
                      <div className="mb-4 flex items-center gap-2">
                        <div className="relative flex-1 max-w-sm">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <div className="w-full border rounded-md h-9 pl-9"></div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {subscriptions.slice(0, 3).map(sub => (
                          <div key={sub.id} className="flex items-center justify-between border-b pb-4">
                            <div className="flex items-center gap-3">
                              {sub.logo && (
                                <div className="h-8 w-8 overflow-hidden rounded">
                                  <img src={sub.logo} alt={`${sub.name} logo`} className="h-full w-full object-cover" />
                                </div>
                              )}
                              <div>
                                <h4 className="text-sm font-medium">{sub.name}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span>{sub.type === 'paid' ? `$${sub.price}/mo` : sub.type}</span>
                                </div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                              {sub.type === 'paid' ? 'Cancel' : 'Unsubscribe'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
              
              {/* Email Integration Preview */}
              <CarouselItem>
                <div className="p-1">
                  <Card className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="mb-4 flex justify-between items-center">
                        <h3 className="text-2xl font-bold text-blue-500">Email Integration</h3>
                        <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-2/3 bg-white rounded-lg border p-4 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="font-medium">Discovered Subscriptions</p>
                              <p className="text-sm text-gray-500">We found these in your inbox</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3 mt-4">
                            {subscriptions.slice(3, 5).map(sub => (
                              <div key={sub.id} className="flex items-center justify-between border-b pb-3">
                                <div className="flex items-center gap-3">
                                  {sub.logo && (
                                    <div className="h-8 w-8 overflow-hidden rounded">
                                      <img src={sub.logo} alt={`${sub.name} logo`} className="h-full w-full object-cover" />
                                    </div>
                                  )}
                                  <div>
                                    <h4 className="text-sm font-medium">{sub.name}</h4>
                                  </div>
                                </div>
                                <Button size="sm" className="h-7 text-xs bg-blue-500 hover:bg-blue-600">Add</Button>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="md:w-1/3 bg-white rounded-lg border p-4 shadow-sm">
                          <div className="flex justify-between items-center mb-4">
                            <p className="font-medium flex items-center">
                              <Mail className="mr-2 h-4 w-4 text-blue-500" />
                              Connect Gmail
                            </p>
                          </div>
                          
                          <p className="text-sm text-gray-500 mb-4">Connect your email to automatically find subscriptions</p>
                          
                          <ul className="space-y-2 mb-4">
                            <li className="flex items-start gap-2 text-xs">
                              <div className="mt-0.5 text-green-500">✓</div>
                              <span>Find hidden subscriptions</span>
                            </li>
                            <li className="flex items-start gap-2 text-xs">
                              <div className="mt-0.5 text-green-500">✓</div>
                              <span>One-click unsubscribe</span>
                            </li>
                          </ul>
                          
                          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-sm">Connect Gmail</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="h-8 w-8 rounded-full -left-4" />
            <CarouselNext className="h-8 w-8 rounded-full -right-4" />
          </Carousel>
          
          <div className="flex justify-center gap-1 mt-4">
            <div className="h-2 w-8 bg-blue-500 rounded-full"></div>
            <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
            <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
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
