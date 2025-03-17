
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Calendar } from 'lucide-react';

const DashboardStats = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-start pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Monthly Spending</CardTitle>
            <p className="text-xs text-muted-foreground">Your subscription costs</p>
          </div>
          <CreditCard className="ml-auto h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-500">$105.54</div>
          <p className="text-xs text-muted-foreground">Across 6 paid subscriptions</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-start pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Subscription Breakdown</CardTitle>
            <p className="text-xs text-muted-foreground">Types of subscriptions</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-blue-500"></div>
              <span className="text-sm">Paid</span>
            </div>
            <span className="text-sm font-medium">6</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100">
            <div className="h-2 w-[50%] rounded-full bg-blue-500"></div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-green-500"></div>
              <span className="text-sm">Free</span>
            </div>
            <span className="text-sm font-medium">2</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100">
            <div className="h-2 w-[17%] rounded-full bg-green-500"></div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-pink-500"></div>
              <span className="text-sm">Newsletters</span>
            </div>
            <span className="text-sm font-medium">4</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100">
            <div className="h-2 w-[33%] rounded-full bg-pink-500"></div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-start pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Upcoming Renewals</CardTitle>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </div>
          <Calendar className="ml-auto h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[124px]">
          <div className="text-center text-muted-foreground">
            <Calendar className="mx-auto h-10 w-10 text-muted-foreground/50 mb-2" />
            <p>No upcoming renewals in the next 7 days</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
