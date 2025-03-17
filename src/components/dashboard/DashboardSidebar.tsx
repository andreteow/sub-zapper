
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardSidebar = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Connect Gmail Box */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center">
            <Mail className="mr-2 h-4 w-4 text-blue-500" />
            Connect Gmail
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Connect your Gmail to scan for subscriptions</p>
          
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm">
              <div className="mt-0.5 text-green-500">✓</div>
              <span>Scan your inbox for subscription emails</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <div className="mt-0.5 text-green-500">✓</div>
              <span>One-click unsubscribe from unwanted emails</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <div className="mt-0.5 text-green-500">✓</div>
              <span>Track paid subscriptions and get renewal alerts</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <div className="mt-0.5 text-green-500">✓</div>
              <span>Read-only access. Your data is encrypted.</span>
            </li>
          </ul>
          
          <Button className="w-full bg-blue-500 hover:bg-blue-600">
            Sign in to Connect Gmail
          </Button>
        </CardContent>
      </Card>
      
      {/* Upcoming Renewals (30 days) */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-yellow-500" />
            Upcoming Renewals
          </CardTitle>
          <p className="text-xs text-muted-foreground">Subscriptions renewing in the next 30 days</p>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-6">
          <div className="text-center text-muted-foreground">
            <Calendar className="mx-auto h-10 w-10 text-muted-foreground/50 mb-2" />
            <p>No upcoming renewals in the next 30 days</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSidebar;
