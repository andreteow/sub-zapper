
import React, { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { subscriptions as mockSubscriptions } from '@/data/mockData';
import SubscriptionItem from './SubscriptionItem';
import { Subscription } from '@/types/subscription';

interface SubscriptionsListProps {
  detectedSubscriptions?: Subscription[];
}

const SubscriptionsList = ({ detectedSubscriptions = [] }: SubscriptionsListProps) => {
  const [allSubscriptions, setAllSubscriptions] = useState<Subscription[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // Combine mock subscriptions with detected ones, avoiding duplicates
    const combinedSubscriptions = [...mockSubscriptions];
    
    detectedSubscriptions.forEach(detected => {
      const isDuplicate = combinedSubscriptions.some(
        existing => existing.name.toLowerCase() === detected.name.toLowerCase()
      );
      
      if (!isDuplicate) {
        combinedSubscriptions.push(detected);
      }
    });
    
    setAllSubscriptions(combinedSubscriptions);
  }, [detectedSubscriptions]);
  
  // Filter subscriptions based on search query
  const filterSubscriptions = (subscriptions: Subscription[], query: string) => {
    if (!query) return subscriptions;
    
    return subscriptions.filter(sub => 
      sub.name.toLowerCase().includes(query.toLowerCase()) ||
      (sub.email && sub.email.toLowerCase().includes(query.toLowerCase()))
    );
  };
  
  const filteredSubscriptions = filterSubscriptions(allSubscriptions, searchQuery);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Your Subscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search subscriptions..." 
              className="pl-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
              {filteredSubscriptions.slice(0, 8).map((sub) => (
                <SubscriptionItem key={sub.id} subscription={sub} />
              ))}
              
              {filteredSubscriptions.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No subscriptions found
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="paid">
            <div className="space-y-4">
              {filteredSubscriptions.filter(sub => sub.type === 'paid').slice(0, 8).map((sub) => (
                <SubscriptionItem key={sub.id} subscription={sub} />
              ))}
              
              {filteredSubscriptions.filter(sub => sub.type === 'paid').length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No paid subscriptions found
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="free">
            <div className="space-y-4">
              {filteredSubscriptions.filter(sub => sub.type === 'free').slice(0, 8).map((sub) => (
                <SubscriptionItem key={sub.id} subscription={sub} />
              ))}
              
              {filteredSubscriptions.filter(sub => sub.type === 'free').length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No free subscriptions found
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="newsletter">
            <div className="space-y-4">
              {filteredSubscriptions.filter(sub => sub.type === 'newsletter').slice(0, 8).map((sub) => (
                <SubscriptionItem key={sub.id} subscription={sub} />
              ))}
              
              {filteredSubscriptions.filter(sub => sub.type === 'newsletter').length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No newsletters found
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SubscriptionsList;
