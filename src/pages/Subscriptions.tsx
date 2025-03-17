
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SubscriptionList from '@/components/subscriptions/SubscriptionList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

const Subscriptions = () => {
  return (
    <AppLayout>
      <DashboardHeader 
        title="Subscriptions" 
        subtitle="Manage all your subscriptions in one place"
      />
      
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="free">Free</TabsTrigger>
              <TabsTrigger value="newsletter">Newsletters</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <SubscriptionList />
            </TabsContent>
            <TabsContent value="paid">
              <SubscriptionList filter="paid" />
            </TabsContent>
            <TabsContent value="free">
              <SubscriptionList filter="free" />
            </TabsContent>
            <TabsContent value="newsletter">
              <SubscriptionList filter="newsletter" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Subscriptions;
