
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { subscriptions } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, DollarSign } from 'lucide-react';

const Renewals = () => {
  // Get all subscriptions with renewal dates, which are paid
  const renewals = subscriptions
    .filter(sub => sub.renewalDate && sub.type === 'paid')
    .sort((a, b) => {
      const dateA = new Date(a.renewalDate!);
      const dateB = new Date(b.renewalDate!);
      return dateA.getTime() - dateB.getTime();
    });

  // Create groups: upcoming (next 7 days), this month, future
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  const upcomingRenewals = renewals.filter(sub => {
    const renewalDate = new Date(sub.renewalDate!);
    return renewalDate >= today && renewalDate <= nextWeek;
  });
  
  const thisMonthRenewals = renewals.filter(sub => {
    const renewalDate = new Date(sub.renewalDate!);
    return renewalDate > nextWeek && renewalDate <= thisMonthEnd;
  });
  
  const futureRenewals = renewals.filter(sub => {
    const renewalDate = new Date(sub.renewalDate!);
    return renewalDate > thisMonthEnd;
  });

  const formatRenewalDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getDaysUntilRenewal = (dateString: string) => {
    const today = new Date();
    const renewalDate = new Date(dateString);
    const diffTime = Math.abs(renewalDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const RenewalsList = ({ renewals }: { renewals: typeof subscriptions }) => {
    if (renewals.length === 0) {
      return (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="text-muted-foreground">No renewals in this period</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {renewals.map(sub => (
          <div key={sub.id} className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-4">
              {sub.logo && (
                <div className="h-12 w-12 overflow-hidden rounded">
                  <img 
                    src={sub.logo} 
                    alt={`${sub.name} logo`}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div>
                <h4 className="font-medium">{sub.name}</h4>
                <div className="mt-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    <span>{formatRenewalDate(sub.renewalDate!)}</span>
                    <span className="px-1">•</span>
                    <span>In {getDaysUntilRenewal(sub.renewalDate!)} days</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {sub.price && (
                <div className="flex items-center text-lg font-semibold">
                  <DollarSign className="h-4 w-4" />
                  <span>{sub.price}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <AppLayout>
      <DashboardHeader 
        title="Renewal Timeline" 
        subtitle="Track upcoming subscription renewals"
      />
      
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="upcoming">
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">This Week</TabsTrigger>
              <TabsTrigger value="thisMonth">This Month</TabsTrigger>
              <TabsTrigger value="future">Future</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
              <RenewalsList renewals={upcomingRenewals} />
            </TabsContent>
            <TabsContent value="thisMonth">
              <RenewalsList renewals={thisMonthRenewals} />
            </TabsContent>
            <TabsContent value="future">
              <RenewalsList renewals={futureRenewals} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Renewals;
