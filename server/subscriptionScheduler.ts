import { storage } from './storage';
import { sendRenewalReminderEmail, sendListingsHiddenEmail, sendMoveInReminderEmail } from './email';
import { format } from 'date-fns';

const GRACE_PERIOD_DAYS = 7;
const MOVE_IN_REMINDER_DAYS = 3;

export async function processRenewalReminders(): Promise<void> {
  console.log('[Scheduler] Checking for subscriptions needing renewal reminders...');
  
  try {
    const subscriptionsToRemind = await storage.getSubscriptionsNeedingRenewalReminder();
    
    for (const subscription of subscriptionsToRemind) {
      const provider = await storage.getUser(subscription.providerId);
      if (!provider) continue;
      
      console.log(`[Scheduler] Sending renewal reminder to ${provider.email}`);
      
      const sent = await sendRenewalReminderEmail(
        provider.email,
        provider.name,
        subscription.currentPeriodEnd
      );
      
      if (sent) {
        await storage.updateSubscription(subscription.providerId, {
          renewalReminderSent: true
        });
        console.log(`[Scheduler] Renewal reminder sent to ${provider.email}`);
      }
    }
    
    console.log(`[Scheduler] Processed ${subscriptionsToRemind.length} renewal reminders`);
  } catch (error) {
    console.error('[Scheduler] Error processing renewal reminders:', error);
  }
}

export async function processExpiredGracePeriods(): Promise<void> {
  console.log('[Scheduler] Checking for expired grace periods...');
  
  try {
    const expiredSubscriptions = await storage.getExpiredGracePeriodSubscriptions();
    
    for (const subscription of expiredSubscriptions) {
      const provider = await storage.getUser(subscription.providerId);
      if (!provider) continue;
      
      console.log(`[Scheduler] Grace period expired for provider ${provider.email}, hiding listings`);
      
      await storage.hideProviderListings(subscription.providerId);
      
      await storage.updateSubscription(subscription.providerId, {
        status: 'canceled'
      });
      
      await sendListingsHiddenEmail(provider.email, provider.name);
      
      console.log(`[Scheduler] Listings hidden for provider ${provider.email}`);
    }
    
    console.log(`[Scheduler] Processed ${expiredSubscriptions.length} expired grace periods`);
  } catch (error) {
    console.error('[Scheduler] Error processing expired grace periods:', error);
  }
}

export async function handleSubscriptionCanceled(providerId: number): Promise<void> {
  const gracePeriodEndsAt = new Date();
  gracePeriodEndsAt.setDate(gracePeriodEndsAt.getDate() + GRACE_PERIOD_DAYS);
  
  await storage.updateSubscription(providerId, {
    status: 'grace_period',
    canceledAt: new Date(),
    gracePeriodEndsAt
  });
  
  console.log(`[Subscription] Provider ${providerId} entered grace period until ${gracePeriodEndsAt}`);
}

export async function handleSubscriptionReactivated(providerId: number): Promise<void> {
  // Clear grace period fields and restore active status
  await storage.updateSubscription(providerId, {
    status: 'active',
    renewalReminderSent: false
  });
  
  // Also clear the grace period dates using raw update
  const { db } = await import('./db');
  const { subscriptions } = await import('@shared/schema');
  const { eq } = await import('drizzle-orm');
  await db.update(subscriptions)
    .set({ 
      canceledAt: null as any, 
      gracePeriodEndsAt: null as any 
    })
    .where(eq(subscriptions.providerId, providerId));
  
  await storage.showProviderListings(providerId);
  
  console.log(`[Subscription] Provider ${providerId} subscription reactivated, listings restored`);
}

export async function processMoveInReminders(): Promise<void> {
  console.log('[Scheduler] Checking for upcoming move-ins...');
  
  try {
    const upcomingMoveIns = await storage.getUpcomingMoveIns(MOVE_IN_REMINDER_DAYS);
    
    for (const application of upcomingMoveIns) {
      const tenant = await storage.getUser(application.tenantId);
      const listing = await storage.getListing(application.listingId);
      
      if (!tenant || !listing || !application.moveInDate) continue;
      
      console.log(`[Scheduler] Sending move-in reminder to ${tenant.email}`);
      
      const sent = await sendMoveInReminderEmail(
        tenant.email,
        tenant.name || 'Tenant',
        listing.propertyName,
        format(new Date(application.moveInDate), 'MMMM d, yyyy')
      );
      
      if (sent) {
        await storage.markMoveInReminderSent(application.id);
        console.log(`[Scheduler] Move-in reminder sent to ${tenant.email}`);
      }
    }
    
    console.log(`[Scheduler] Processed ${upcomingMoveIns.length} move-in reminders`);
  } catch (error) {
    console.error('[Scheduler] Error processing move-in reminders:', error);
  }
}

export function startSubscriptionScheduler(): void {
  const CHECK_INTERVAL = 60 * 60 * 1000;
  
  console.log('[Scheduler] Starting subscription lifecycle scheduler...');
  
  processRenewalReminders();
  processExpiredGracePeriods();
  processMoveInReminders();
  
  setInterval(async () => {
    await processRenewalReminders();
    await processExpiredGracePeriods();
    await processMoveInReminders();
  }, CHECK_INTERVAL);
  
  console.log('[Scheduler] Scheduler started, checking every hour');
}
