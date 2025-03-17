
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SubscriptionStats from '@/components/dashboard/SubscriptionStats';
import ConnectEmailCard from '@/components/onboarding/ConnectEmailCard';
import RenewalTimeline from '@/components/renewals/RenewalTimeline';
import SubscriptionList from '@/components/subscriptions/SubscriptionList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  return (
    <AppLayout>
      <DashboardHeader 
        title="Dashboard" 
        subtitle="Manage your subscriptions and track spending"
      />
      
      <div className="grid gap-6">
        <SubscriptionStats />
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="paid">Paid</TabsTrigger>
                    <TabsTrigger value="free">Free</TabsTrigger>
                    <TabsTrigger value="newsletter">Newsletters</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all">
                    <SubscriptionList limit={6} />
                  </TabsContent>
                  <TabsContent value="paid">
                    <SubscriptionList filter="paid" limit={6} />
                  </TabsContent>
                  <TabsContent value="free">
                    <SubscriptionList filter="free" limit={6} />
                  </TabsContent>
                  <TabsContent value="newsletter">
                    <SubscriptionList filter="newsletter" limit={6} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col gap-6">
            <ConnectEmailCard />
            <RenewalTimeline />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
