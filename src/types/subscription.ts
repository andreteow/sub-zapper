
export type SubscriptionType = 'paid' | 'free' | 'newsletter';

export interface Subscription {
  id: string;
  name: string;
  type: SubscriptionType;
  price?: number;
  renewalDate?: string;
  logo?: string;
  managementUrl?: string;
  lastCharge?: string;
  email?: string;
  unsubscribeUrl?: string;
  detectedDate: string;
}
