export interface ProviderSubscription {
  providerId: string;
  listings: string[]; // array of property IDs
  subscriptionStatus: "active" | "canceled" | "expired" | "pending";
  currentPeriodEnd: string; // ISO date string
  monthlyFee: number; // $49 per listing
  createdAt: string;
  paymentMethod?: string;
}

export interface Subscription {
  [providerId: string]: ProviderSubscription;
}

const STORAGE_KEY = "provider_subscriptions";
const PRICE_PER_LISTING = 49;

export function getProviderSubscription(providerId: string): ProviderSubscription | null {
  const subs = localStorage.getItem(STORAGE_KEY);
  if (!subs) return null;
  const subscriptions: Subscription = JSON.parse(subs);
  return subscriptions[providerId] || null;
}

export function addListingToSubscription(providerId: string): boolean {
  const sub = getProviderSubscription(providerId);
  
  if (!sub) {
    return false; // Need to create subscription first
  }

  const subs = localStorage.getItem(STORAGE_KEY);
  const subscriptions: Subscription = subs ? JSON.parse(subs) : {};
  
  // Add new property (mock property ID)
  const newPropertyId = `property_${Date.now()}`;
  subscriptions[providerId].listings.push(newPropertyId);
  subscriptions[providerId].monthlyFee = subscriptions[providerId].listings.length * PRICE_PER_LISTING;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
  return true;
}

export function createSubscription(providerId: string): ProviderSubscription {
  const now = new Date();
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  const newSub: ProviderSubscription = {
    providerId,
    listings: [],
    subscriptionStatus: "active",
    currentPeriodEnd: nextMonth.toISOString(),
    monthlyFee: PRICE_PER_LISTING,
    createdAt: now.toISOString(),
    paymentMethod: "card_ending_4242",
  };

  const subs = localStorage.getItem(STORAGE_KEY);
  const subscriptions: Subscription = subs ? JSON.parse(subs) : {};
  subscriptions[providerId] = newSub;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
  return newSub;
}

export function isSubscriptionActive(providerId: string): boolean {
  const sub = getProviderSubscription(providerId);
  if (!sub) return false;
  
  const expiryDate = new Date(sub.currentPeriodEnd);
  return sub.subscriptionStatus === "active" && expiryDate > new Date();
}

export function getMonthlyFee(providerId: string): number {
  const sub = getProviderSubscription(providerId);
  return sub ? sub.monthlyFee : PRICE_PER_LISTING;
}

export function cancelSubscription(providerId: string): void {
  const subs = localStorage.getItem(STORAGE_KEY);
  if (!subs) return;
  
  const subscriptions: Subscription = JSON.parse(subs);
  if (subscriptions[providerId]) {
    subscriptions[providerId].subscriptionStatus = "canceled";
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
  }
}
