
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ChevronDown, CreditCard, Search, Mail, Calendar } from 'lucide-react';
import { subscriptions } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  return (
    <AppLayout>
      <DashboardHeader 
        title="Dashboard" 
        subtitle="Manage your subscriptions and track spending"
      />
      
      <div className="grid gap-6">
        {/* Top Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-start pb-2">
              <div>
                <CardTitle className="text-sm font-medium">Monthly Spending</CardTitle>
                <p className="text-xs text-muted-foreground">Your subscription costs</p>
              </div>
              <CreditCard className="ml-auto h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">$105.54</div>
              <p className="text-xs text-muted-foreground">Across 6 paid subscriptions</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-start pb-2">
              <div>
                <CardTitle className="text-sm font-medium">Subscription Breakdown</CardTitle>
                <p className="text-xs text-muted-foreground">Types of subscriptions</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-blue-500"></div>
                  <span className="text-sm">Paid</span>
                </div>
                <span className="text-sm font-medium">6</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100">
                <div className="h-2 w-[50%] rounded-full bg-blue-500"></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-green-500"></div>
                  <span className="text-sm">Free</span>
                </div>
                <span className="text-sm font-medium">2</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100">
                <div className="h-2 w-[17%] rounded-full bg-green-500"></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-pink-500"></div>
                  <span className="text-sm">Newsletters</span>
                </div>
                <span className="text-sm font-medium">4</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100">
                <div className="h-2 w-[33%] rounded-full bg-pink-500"></div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-start pb-2">
              <div>
                <CardTitle className="text-sm font-medium">Upcoming Renewals</CardTitle>
                <p className="text-xs text-muted-foreground">Next 7 days</p>
              </div>
              <Calendar className="ml-auto h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[124px]">
              <div className="text-center text-muted-foreground">
                <Calendar className="mx-auto h-10 w-10 text-muted-foreground/50 mb-2" />
                <p>No upcoming renewals in the next 7 days</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Subscriptions List */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Your Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search subscriptions..." className="pl-9" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Date Added</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                
                <Tabs defaultValue="all">
                  <TabsList className="mb-4 inline-flex w-full border-b pb-0 bg-transparent">
                    <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">All</TabsTrigger>
                    <TabsTrigger value="paid" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Paid</TabsTrigger>
                    <TabsTrigger value="free" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Free</TabsTrigger>
                    <TabsTrigger value="newsletter" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Newsletters</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all">
                    <div className="space-y-4">
                      {subscriptions.slice(0, 4).map((sub) => (
                        <SubscriptionItem key={sub.id} subscription={sub} />
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="paid">
                    <div className="space-y-4">
                      {subscriptions.filter(sub => sub.type === 'paid').slice(0, 4).map((sub) => (
                        <SubscriptionItem key={sub.id} subscription={sub} />
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="free">
                    <div className="space-y-4">
                      {subscriptions.filter(sub => sub.type === 'free').slice(0, 4).map((sub) => (
                        <SubscriptionItem key={sub.id} subscription={sub} />
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="newsletter">
                    <div className="space-y-4">
                      {subscriptions.filter(sub => sub.type === 'newsletter').slice(0, 4).map((sub) => (
                        <SubscriptionItem key={sub.id} subscription={sub} />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col gap-6">
            {/* Connect Gmail Box */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-blue-500" />
                  Connect Gmail
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Connect your Gmail to scan for subscriptions</p>
                
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <div className="mt-0.5 text-green-500">✓</div>
                    <span>Scan your inbox for subscription emails</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="mt-0.5 text-green-500">✓</div>
                    <span>One-click unsubscribe from unwanted emails</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="mt-0.5 text-green-500">✓</div>
                    <span>Track paid subscriptions and get renewal alerts</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="mt-0.5 text-green-500">✓</div>
                    <span>Read-only access. Your data is encrypted.</span>
                  </li>
                </ul>
                
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  Sign in to Connect Gmail
                </Button>
              </CardContent>
            </Card>
            
            {/* Upcoming Renewals (30 days) */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-yellow-500" />
                  Upcoming Renewals
                </CardTitle>
                <p className="text-xs text-muted-foreground">Subscriptions renewing in the next 30 days</p>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-6">
                <div className="text-center text-muted-foreground">
                  <Calendar className="mx-auto h-10 w-10 text-muted-foreground/50 mb-2" />
                  <p>No upcoming renewals in the next 30 days</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

// Subscription Item Component
const SubscriptionItem = ({ subscription }) => {
  const getBadgeClass = (type) => {
    switch (type) {
      case 'paid':
        return 'bg-blue-50 text-blue-500 hover:bg-blue-100';
      case 'free':
        return 'bg-green-50 text-green-500 hover:bg-green-100';
      case 'newsletter':
        return 'bg-pink-50 text-pink-500 hover:bg-pink-100';
      default:
        return 'bg-gray-50 text-gray-500 hover:bg-gray-100';
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;
  };
  
  const formatRenewalDate = (dateString) => {
    if (!dateString) return null;
    const renewalDate = new Date(dateString);
    const now = new Date();
    
    // Fix: Use getTime() to convert dates to numbers for arithmetic operations
    const diffTime = Math.abs(renewalDate.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Tomorrow";
    } else {
      return `${renewalDate.toLocaleString('default', { month: 'short' })} ${renewalDate.getDate()}`;
    }
  };

  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div className="flex items-center gap-4">
        {subscription.logo && (
          <div className="h-10 w-10 overflow-hidden rounded">
            <img 
              src={subscription.logo} 
              alt={`${subscription.name} logo`}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{subscription.name}</h3>
            <Badge className={getBadgeClass(subscription.type)}>
              {subscription.type === 'newsletter' ? 'Newsletter' : subscription.type.charAt(0).toUpperCase() + subscription.type.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Added {formatDate(subscription.renewalDate || '2023-05-15')}</span>
            {subscription.email && <span>{subscription.email}</span>}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {subscription.type === 'newsletter' ? (
          <Button variant="outline" size="sm" className="h-8 text-xs border-pink-200 text-pink-500 hover:bg-pink-50">
            Unsubscribe
          </Button>
        ) : subscription.type === 'paid' ? (
          <div className="flex flex-col items-end">
            <span className="font-medium text-blue-500">${subscription.price}/mo</span>
            {subscription.renewalDate && (
              <span className="text-xs text-muted-foreground">
                Renews {formatRenewalDate(subscription.renewalDate)}
              </span>
            )}
          </div>
        ) : (
          <Button variant="outline" size="sm" className="h-8 text-xs border-green-200 text-green-500 hover:bg-green-50">
            Unsubscribe
          </Button>
        )}
        
        {subscription.type === 'paid' && (
          <Button variant="outline" size="sm" className="h-8 text-xs">
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default Index;
