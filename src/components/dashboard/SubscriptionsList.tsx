
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
  const [isInitialized, setIsInitialized] = useState(false);
  const [sortField, setSortField] = useState<'dateAdded' | 'name'>('dateAdded');
  
  useEffect(() => {
    // Load any saved subscriptions from local storage
    const savedSubscriptions = localStorage.getItem('detected_subscriptions');
    let parsedSubscriptions: Subscription[] = [];
    
    if (savedSubscriptions) {
      try {
        parsedSubscriptions = JSON.parse(savedSubscriptions);
        console.log("Loaded saved subscriptions:", parsedSubscriptions);
      } catch (e) {
        console.error("Error parsing saved subscriptions:", e);
      }
    }
    
    // Combine with newly detected subscriptions, prioritizing detected ones
    const combinedSubs = [...detectedSubscriptions];
    
    if (detectedSubscriptions.length === 0 && parsedSubscriptions.length > 0) {
      // If no new detections but we have saved ones, use those
      combinedSubs.push(...parsedSubscriptions);
    }
    
    if (combinedSubs.length > 0) {
      // If we have detected or saved subscriptions, use those (replace mock data)
      setAllSubscriptions(combinedSubs);
      console.log("Using detected/saved subscriptions:", combinedSubs.length);
    } else {
      // If no detected or saved subscriptions, fall back to mock data
      setAllSubscriptions(mockSubscriptions);
      console.log("Using mock subscriptions as fallback");
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
      // sort by date (most recent first)
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
                filteredSubscriptions.slice(0, 8).map((sub) => (
                  <SubscriptionItem key={sub.id} subscription={sub} />
                ))
              ) : isInitialized ? (
                <div className="text-center py-4 text-muted-foreground">
                  No subscriptions found. Try analyzing your emails to detect subscriptions.
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="animate-pulse h-16 bg-gray-100 rounded-md mb-4"></div>
                  <div className="animate-pulse h-16 bg-gray-100 rounded-md mb-4"></div>
                  <div className="animate-pulse h-16 bg-gray-100 rounded-md"></div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="paid">
            <div className="space-y-4">
              {filteredSubscriptions.filter(sub => sub.type === 'paid').length > 0 ? (
                filteredSubscriptions.filter(sub => sub.type === 'paid').slice(0, 8).map((sub) => (
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
                filteredSubscriptions.filter(sub => sub.type === 'free').slice(0, 8).map((sub) => (
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
                filteredSubscriptions.filter(sub => sub.type === 'newsletter').slice(0, 8).map((sub) => (
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
