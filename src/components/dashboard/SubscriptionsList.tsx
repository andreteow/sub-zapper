import React, { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import SubscriptionItem from './SubscriptionItem';
import { Subscription } from '@/types/subscription';

interface SubscriptionsListProps {
  detectedSubscriptions?: Subscription[];
}

const SubscriptionsList = ({ detectedSubscriptions = [] }: SubscriptionsListProps) => {
  const [allSubscriptions, setAllSubscriptions] = useState<Subscription[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [sortField, setSortField] = useState<'dateAdded' | 'name'>('dateAdded');
  
  useEffect(() => {
    // If we have detected subscriptions from props, use those first
    if (detectedSubscriptions && detectedSubscriptions.length > 0) {
      console.log("Setting subscriptions from props:", detectedSubscriptions.length);
      setAllSubscriptions(detectedSubscriptions);
      setIsInitialized(true);
      return;
    }
    
    // Otherwise, try to load from localStorage
    const savedSubscriptions = localStorage.getItem('detected_subscriptions');
    if (savedSubscriptions) {
      try {
        const parsedSubscriptions = JSON.parse(savedSubscriptions);
        if (Array.isArray(parsedSubscriptions) && parsedSubscriptions.length > 0) {
          console.log("Setting subscriptions from localStorage:", parsedSubscriptions.length);
          setAllSubscriptions(parsedSubscriptions);
        }
      } catch (e) {
        console.error("Error parsing saved subscriptions:", e);
      }
    }
    setIsInitialized(true);
  }, [detectedSubscriptions]);
  
  // Filter subscriptions based on search query
  const filterSubscriptions = (subscriptions: Subscription[], query: string) => {
    if (!query) return subscriptions;
    
    return subscriptions.filter(sub => 
      sub.name.toLowerCase().includes(query.toLowerCase()) ||
      (sub.email && sub.email.toLowerCase().includes(query.toLowerCase()))
    );
  };
  
  // Sort subscriptions
  const sortSubscriptions = (subscriptions: Subscription[]) => {
    if (sortField === 'name') {
      return [...subscriptions].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      return [...subscriptions].sort((a, b) => {
        const dateA = a.detectedDate || a.renewalDate || '';
        const dateB = b.detectedDate || b.renewalDate || '';
        return dateB.localeCompare(dateA);
      });
    }
  };
  
  const toggleSort = () => {
    setSortField(sortField === 'dateAdded' ? 'name' : 'dateAdded');
  };
  
  const filteredSubscriptions = sortSubscriptions(filterSubscriptions(allSubscriptions, searchQuery));

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
          <button 
            onClick={toggleSort}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <span>{sortField === 'dateAdded' ? 'Date Added' : 'Name'}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
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
              {filteredSubscriptions.length > 0 ? (
                filteredSubscriptions.map((sub) => (
                  <SubscriptionItem key={sub.id} subscription={sub} />
                ))
              ) : isInitialized ? (
                <div className="text-center py-4 text-muted-foreground">
                  No subscriptions found. Try analyzing your emails to detect subscriptions.
                </div>
              ) : (
                <div className="text-center py-4">
                  Loading subscriptions...
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="paid">
            <div className="space-y-4">
              {filteredSubscriptions.filter(sub => sub.type === 'paid').length > 0 ? (
                filteredSubscriptions.filter(sub => sub.type === 'paid').map((sub) => (
                  <SubscriptionItem key={sub.id} subscription={sub} />
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No paid subscriptions found
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="free">
            <div className="space-y-4">
              {filteredSubscriptions.filter(sub => sub.type === 'free').length > 0 ? (
                filteredSubscriptions.filter(sub => sub.type === 'free').map((sub) => (
                  <SubscriptionItem key={sub.id} subscription={sub} />
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No free subscriptions found
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="newsletter">
            <div className="space-y-4">
              {filteredSubscriptions.filter(sub => sub.type === 'newsletter').length > 0 ? (
                filteredSubscriptions.filter(sub => sub.type === 'newsletter').map((sub) => (
                  <SubscriptionItem key={sub.id} subscription={sub} />
                ))
              ) : (
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
