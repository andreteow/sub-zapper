
// Define email interface
export interface EmailHeader {
  id: string;
  threadId: string;
  snippet: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  labelIds: string[];
  fullBody?: string;  // For storing the full email body if available
}

// Define subscription types
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
