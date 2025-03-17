
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SubscriptionCard } from './SubscriptionCard';

// Mock data
import { subscriptions } from '@/data/mockData';

interface SubscriptionListProps {
  filter?: 'all' | 'paid' | 'free' | 'newsletter';
  limit?: number;
}

const SubscriptionList = ({ filter = 'all', limit }: SubscriptionListProps) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showAll, setShowAll] = React.useState(false);

  const filteredSubscriptions = subscriptions.filter(subscription => {
    // Apply category filter
    if (filter !== 'all' && subscription.type !== filter) {
      return false;
    }
    
    // Apply search filter (if any)
    if (searchQuery) {
      return subscription.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return true;
  });

  const displayedSubscriptions = showAll || !limit 
    ? filteredSubscriptions 
    : filteredSubscriptions.slice(0, limit);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search subscriptions..." 
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {displayedSubscriptions.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No subscriptions found</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayedSubscriptions.map((subscription) => (
            <SubscriptionCard 
              key={subscription.id} 
              subscription={subscription} 
            />
          ))}
        </div>
      )}
      
      {limit && filteredSubscriptions.length > limit && (
        <div className="flex justify-center pt-2">
          <Button
            variant="ghost"
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1"
          >
            {showAll ? (
              <>
                <ChevronUp className="h-4 w-4" />
                <span>Show Less</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                <span>Show All ({filteredSubscriptions.length})</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionList;
