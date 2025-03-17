
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { subscriptions } from '@/data/mockData';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RenewalTimeline = () => {
  // Get upcoming renewals in the next 30 days
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  
  const upcomingRenewals = subscriptions
    .filter(sub => {
      if (!sub.renewalDate) return false;
      const renewalDate = new Date(sub.renewalDate);
      return renewalDate >= today && renewalDate <= thirtyDaysFromNow;
    })
    .sort((a, b) => {
      const dateA = new Date(a.renewalDate!);
      const dateB = new Date(b.renewalDate!);
      return dateA.getTime() - dateB.getTime();
    });

  const formatRenewalDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const getDaysUntilRenewal = (dateString: string) => {
    const today = new Date();
    const renewalDate = new Date(dateString);
    const diffTime = Math.abs(renewalDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Renewals</CardTitle>
        <CalendarDays className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {upcomingRenewals.length === 0 ? (
          <div className="rounded-lg border border-dashed p-4 text-center">
            <p className="text-muted-foreground">No upcoming renewals</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingRenewals.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  {sub.logo && (
                    <div className="h-10 w-10 overflow-hidden rounded">
                      <img 
                        src={sub.logo} 
                        alt={`${sub.name} logo`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium">{sub.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span>Renews in {getDaysUntilRenewal(sub.renewalDate!)} days</span>
                      <span className="px-1">•</span>
                      <span>{formatRenewalDate(sub.renewalDate!)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {sub.price && (
                    <span className="font-medium">${sub.price}</span>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full">
              View All Renewals
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RenewalTimeline;
