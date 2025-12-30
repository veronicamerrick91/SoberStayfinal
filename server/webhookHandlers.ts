import { getStripeSync, getUncachableStripeClient } from './stripeClient';
import { storage } from './storage';
import { handleSubscriptionCanceled, handleSubscriptionReactivated } from './subscriptionScheduler';
import { sendSubscriptionCanceledEmail, sendAdminSubscriptionNotification } from './email';

const GRACE_PERIOD_DAYS = 7;

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string, uuid: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Received type: ' + typeof payload + '. ' +
        'This usually means express.json() parsed the body before reaching this handler. ' +
        'FIX: Ensure webhook route is registered BEFORE app.use(express.json()).'
      );
    }

    const sync = await getStripeSync();
    await sync.processWebhook(payload, signature, uuid);
    
    // Parse event and handle subscription lifecycle
    try {
      const stripe = await getUncachableStripeClient();
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
      
      await WebhookHandlers.handleSubscriptionEvents(event);
    } catch (err) {
      console.log('[Webhook] Could not parse event for lifecycle handling (may be normal if no webhook secret):', err);
    }
  }
  
  static async handleSubscriptionEvents(event: any): Promise<void> {
    const eventType = event.type;
    const data = event.data?.object;
    
    if (!data) return;
    
    console.log(`[Webhook] Processing event: ${eventType}`);
    
    switch (eventType) {
      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        const customerId = data.customer;
        const status = data.status;
        const cancelAtPeriodEnd = data.cancel_at_period_end;
        
        // Find provider by Stripe customer ID
        const users = await storage.getAllUsers();
        const provider = users.find(u => u.stripeCustomerId === customerId);
        
        if (!provider) {
          console.log(`[Webhook] No provider found for customer ${customerId}`);
          return;
        }
        
        console.log(`[Webhook] Subscription ${status} for provider ${provider.id}, cancelAtPeriodEnd: ${cancelAtPeriodEnd}`);
        
        // Handle cancellation
        if (status === 'canceled' || (status === 'active' && cancelAtPeriodEnd)) {
          const gracePeriodEndsAt = new Date();
          gracePeriodEndsAt.setDate(gracePeriodEndsAt.getDate() + GRACE_PERIOD_DAYS);
          
          await handleSubscriptionCanceled(provider.id);
          await sendSubscriptionCanceledEmail(provider.email, provider.name, gracePeriodEndsAt);
          
          // Notify admins of subscription cancellation
          sendAdminSubscriptionNotification(provider.name || 'Provider', provider.email, 'canceled')
            .catch(err => console.error('[Webhook] Failed to send admin subscription notification:', err));
          
          console.log(`[Webhook] Provider ${provider.id} entered grace period`);
        }
        // Handle reactivation
        else if (status === 'active' && !cancelAtPeriodEnd) {
          const subscription = await storage.getSubscriptionByProvider(provider.id);
          if (subscription?.status === 'grace_period' || subscription?.status === 'canceled') {
            await handleSubscriptionReactivated(provider.id);
            
            // Notify admins of subscription reactivation
            sendAdminSubscriptionNotification(provider.name || 'Provider', provider.email, 'started')
              .catch(err => console.error('[Webhook] Failed to send admin subscription notification:', err));
            
            console.log(`[Webhook] Provider ${provider.id} subscription reactivated`);
          }
        }
        break;
      }
      
      case 'invoice.payment_failed': {
        const customerId = data.customer;
        const users = await storage.getAllUsers();
        const provider = users.find(u => u.stripeCustomerId === customerId);
        
        if (provider) {
          console.log(`[Webhook] Payment failed for provider ${provider.id}`);
          // Mark as past_due - listings stay visible but warn provider
          await storage.updateSubscription(provider.id, { status: 'past_due' });
        }
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const customerId = data.customer;
        const users = await storage.getAllUsers();
        const provider = users.find(u => u.stripeCustomerId === customerId);
        
        if (provider) {
          console.log(`[Webhook] Payment succeeded for provider ${provider.id}`);
          
          // Check if this is a new subscription (no existing active subscription)
          const existingSubscription = await storage.getSubscriptionByProvider(provider.id);
          const isNewSubscription = !existingSubscription || existingSubscription.status !== 'active';
          
          // Reset renewal reminder flag for next cycle
          await storage.updateSubscription(provider.id, { 
            status: 'active',
            renewalReminderSent: false 
          });
          
          // Increment listing allowance by 1 for each $49 payment (metered billing)
          await storage.incrementListingAllowance(provider.id, 1);
          console.log(`[Webhook] Listing allowance incremented for provider ${provider.id}`);
          
          // Notify admins of new subscription (only for first payment)
          if (isNewSubscription) {
            sendAdminSubscriptionNotification(provider.name || 'Provider', provider.email, 'started')
              .catch(err => console.error('[Webhook] Failed to send admin subscription notification:', err));
          }
        }
        break;
      }
    }
  }
}
