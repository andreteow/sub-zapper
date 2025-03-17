
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bell, Mail, Shield, CreditCard, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Settings = () => {
  return (
    <AppLayout>
      <DashboardHeader 
        title="Settings" 
        subtitle="Manage your account and preferences"
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Account Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value="user@example.com" readOnly />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Account Type</Label>
                <div className="flex items-center gap-2">
                  <span>Free Plan</span>
                  <Badge variant="outline">Upgrade Available</Badge>
                </div>
              </div>
              <Button variant="outline">Upgrade</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle>Email Connection</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Connected Email</Label>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#EA4335">
                    <path d="M22.56 8.665L21.9 9.215 16.98 7.2 12 10.548 7.02 7.2 2.1 9.215l-.66-.55L0 9.215v7.92A1.88 1.88 0 0 0 1.98 19.2h20.04A1.88 1.88 0 0 0 24 17.135V9.215zM7.02 14.965 2.1 12.95v-2.12l4.92 2.015zm9.96-2.295L12 10.215 7.02 12.67 2.1 10.655v-.88l4.92-2.015L12 10.108l4.98-2.348 4.92 2.015v.88zM21.9 12.95l-4.92 2.015v-2.12l4.92-2.015z" />
                  </svg>
                  <span>user@example.com</span>
                </div>
                <Button variant="destructive" size="sm">Disconnect</Button>
              </div>
            </div>
            <div className="flex items-center justify-between space-y-0">
              <div className="space-y-0.5">
                <Label htmlFor="autoScan">Auto Email Scan</Label>
                <div className="text-sm text-muted-foreground">
                  Automatically scan for new subscriptions
                </div>
              </div>
              <Switch id="autoScan" defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-y-0">
              <div className="space-y-0.5">
                <Label htmlFor="renewalAlerts">Renewal Alerts</Label>
                <div className="text-sm text-muted-foreground">
                  Get notified before subscriptions renew
                </div>
              </div>
              <Switch id="renewalAlerts" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between space-y-0">
              <div className="space-y-0.5">
                <Label htmlFor="priceAlerts">Price Change Alerts</Label>
                <div className="text-sm text-muted-foreground">
                  Get notified when subscription prices change
                </div>
              </div>
              <Switch id="priceAlerts" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between space-y-0">
              <div className="space-y-0.5">
                <Label htmlFor="emailDigest">Weekly Email Digest</Label>
                <div className="text-sm text-muted-foreground">
                  Receive a weekly summary of your subscriptions
                </div>
              </div>
              <Switch id="emailDigest" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Privacy</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-y-0">
              <div className="space-y-0.5">
                <Label htmlFor="dataRetention">Data Retention</Label>
                <div className="text-sm text-muted-foreground">
                  How long we keep your subscription data
                </div>
              </div>
              <select id="dataRetention" className="w-24 rounded-md border-input bg-background px-3 py-1 text-sm">
                <option>30 days</option>
                <option>60 days</option>
                <option>90 days</option>
                <option>1 year</option>
              </select>
            </div>
            <Separator />
            <div className="pt-2">
              <Button variant="destructive">Delete All Data</Button>
              <div className="mt-2 text-sm text-muted-foreground">
                This will permanently delete all your subscription data
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Settings;
