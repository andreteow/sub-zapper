
import { EmailHeader, Subscription } from "../types/email.ts";
import { analyzeEmailBatch } from "./openaiService.ts";

/**
 * Process emails in batches and return unique subscriptions
 */
export async function processEmails(emails: EmailHeader[]): Promise<Subscription[]> {
  // Analyze emails in smaller batches to avoid token limits
  const batchSize = 10;
  let allSubscriptions: Subscription[] = [];
  
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i/batchSize) + 1}, with ${batch.length} emails`);
    
    const batchSubscriptions = await analyzeEmailBatch(batch);
    if (batchSubscriptions.length > 0) {
      console.log(`Found ${batchSubscriptions.length} subscriptions in batch ${Math.floor(i/batchSize) + 1}`);
      allSubscriptions = [...allSubscriptions, ...batchSubscriptions];
    }
  }
  
  // Remove duplicate subscriptions based on name and email
  const uniqueSubscriptions = removeDuplicateSubscriptions(allSubscriptions);
  
  logSubscriptionResults(uniqueSubscriptions);
  
  return uniqueSubscriptions;
}

/**
 * Remove duplicate subscriptions based on name and email
 */
function removeDuplicateSubscriptions(subscriptions: Subscription[]): Subscription[] {
  const uniqueMap = new Map();
  
  subscriptions.forEach(subscription => {
    // Create a unique key based on name and email (if available)
    const key = `${subscription.name.toLowerCase()}_${subscription.email || ''}`;
    
    // If this key doesn't exist yet or if the current subscription has more information, update the map
    if (!uniqueMap.has(key) || hasMoreInformation(subscription, uniqueMap.get(key))) {
      uniqueMap.set(key, subscription);
    }
  });
  
  return Array.from(uniqueMap.values());
}

/**
 * Check if a subscription has more information than another
 */
function hasMoreInformation(a: Subscription, b: Subscription): boolean {
  let aScore = 0;
  let bScore = 0;
  
  // Score based on available fields
  if (a.price) aScore += 1;
  if (a.renewalDate) aScore += 1;
  if (a.unsubscribeUrl) aScore += 1;
  if (a.managementUrl) aScore += 1;
  
  if (b.price) bScore += 1;
  if (b.renewalDate) bScore += 1;
  if (b.unsubscribeUrl) bScore += 1;
  if (b.managementUrl) bScore += 1;
  
  return aScore > bScore;
}

/**
 * Log subscription results for debugging
 */
function logSubscriptionResults(subscriptions: Subscription[]): void {
  console.log(`Found ${subscriptions.length} unique subscriptions`);
  console.log("Subscription types breakdown:", 
    subscriptions.reduce((counts, sub) => {
      counts[sub.type] = (counts[sub.type] || 0) + 1;
      return counts;
    }, {} as Record<string, number>)
  );
}
