
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import SubscriptionsList from '@/components/dashboard/SubscriptionsList';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

const Index = () => {
  return (
    <AppLayout>
      <DashboardHeader 
        title="Dashboard" 
        subtitle="Manage your subscriptions and track spending"
      />
      
      <div className="grid gap-6">
        {/* Top Stats Cards */}
        <DashboardStats />
        
        {/* Subscriptions List and Sidebar */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SubscriptionsList />
          </div>
          
          <DashboardSidebar />
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
