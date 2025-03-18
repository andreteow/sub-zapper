
import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import SubscriptionsList from '@/components/dashboard/SubscriptionsList';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import EmailList from '@/components/dashboard/EmailList';
import { Subscription } from '@/types/subscription';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [detectedSubscriptions, setDetectedSubscriptions] = useState<Subscription[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load any previously detected subscriptions from localStorage
    try {
      const storedSubscriptions = localStorage.getItem('detected_subscriptions');
      if (storedSubscriptions) {
        const parsedSubscriptions = JSON.parse(storedSubscriptions);
        if (Array.isArray(parsedSubscriptions) && parsedSubscriptions.length > 0) {
          console.log(`Loaded ${parsedSubscriptions.length} stored subscriptions from localStorage`);
          setDetectedSubscriptions(parsedSubscriptions);
        }
      }
    } catch (error) {
      console.error('Error loading stored subscriptions:', error);
    }
  }, []); // Remove toast from dependencies since it's not used in this effect

  // Listen for subscription detection events
  useEffect(() => {
    const handleSubscriptionsDetected = (event: CustomEvent) => {
      if (event.detail && Array.isArray(event.detail)) {
        console.log(`Received ${event.detail.length} subscriptions from detection event`);
        setDetectedSubscriptions(event.detail);
        
        toast({
          title: "Subscriptions Updated",
          description: `Your subscription list has been updated with ${event.detail.length} detected subscriptions.`
        });
      }
    };

    window.addEventListener('subscriptions_detected', handleSubscriptionsDetected as EventListener);

    return () => {
      window.removeEventListener('subscriptions_detected', handleSubscriptionsDetected as EventListener);
    };
  }, [toast]);

  return (
    <AppLayout>
      <DashboardHeader 
        title="Dashboard" 
        subtitle="Manage your subscriptions and track spending"
      />
      
      <div className="grid gap-6">
        {/* Top Stats Cards */}
        <DashboardStats />
        
        {/* Email List and Subscription Detection */}
        <EmailList />
        
        {/* Subscriptions List and Sidebar */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SubscriptionsList detectedSubscriptions={detectedSubscriptions} />
          </div>
          
          <DashboardSidebar />
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
