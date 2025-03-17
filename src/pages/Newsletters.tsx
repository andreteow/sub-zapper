
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SubscriptionList from '@/components/subscriptions/SubscriptionList';
import { Card, CardContent } from '@/components/ui/card';

const Newsletters = () => {
  return (
    <AppLayout>
      <DashboardHeader 
        title="Newsletters" 
        subtitle="Manage your newsletter subscriptions"
      />
      
      <Card>
        <CardContent className="pt-6">
          <SubscriptionList filter="newsletter" />
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Newsletters;
