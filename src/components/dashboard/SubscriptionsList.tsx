
import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { subscriptions } from '@/data/mockData';
import SubscriptionItem from './SubscriptionItem';

const SubscriptionsList = () => {
  return (
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
  );
};

export default SubscriptionsList;
