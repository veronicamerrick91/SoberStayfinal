import { storage } from './storage';
import { getUncachableStripeClient } from './stripeClient';

const FOUNDING_MEMBER_COUPON_ID = 'FOUNDING_MEMBER_50';

export class StripeService {
  async createCustomer(email: string, userId: number) {
    const stripe = await getUncachableStripeClient();
    return await stripe.customers.create({
      email,
      metadata: { userId: String(userId) },
    });
  }

  async getOrCreateFoundingMemberCoupon(): Promise<string> {
    const stripe = await getUncachableStripeClient();
    
    try {
      const coupon = await stripe.coupons.retrieve(FOUNDING_MEMBER_COUPON_ID);
      return coupon.id;
    } catch (error: any) {
      if (error.code === 'resource_missing') {
        const coupon = await stripe.coupons.create({
          id: FOUNDING_MEMBER_COUPON_ID,
          percent_off: 50,
          duration: 'forever',
          name: 'Founding Member - 50% Off Forever',
        });
        return coupon.id;
      }
      throw error;
    }
  }

  async createCheckoutSession(
    customerId: string, 
    priceId: string, 
    successUrl: string, 
    cancelUrl: string,
    metadata?: { providerId: string; listingId?: string },
    isFoundingMember?: boolean
  ) {
    const stripe = await getUncachableStripeClient();
    
    const sessionParams: any = {
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: metadata,
    };
    
    if (isFoundingMember) {
      const couponId = await this.getOrCreateFoundingMemberCoupon();
      sessionParams.discounts = [{ coupon: couponId }];
    }
    
    return await stripe.checkout.sessions.create(sessionParams);
  }

  async applyFoundingMemberDiscount(subscriptionId: string): Promise<boolean> {
    const stripe = await getUncachableStripeClient();
    
    try {
      const couponId = await this.getOrCreateFoundingMemberCoupon();
      await stripe.subscriptions.update(subscriptionId, {
        discounts: [{ coupon: couponId }],
      });
      console.log(`[Stripe] Applied founding member discount to subscription ${subscriptionId}`);
      return true;
    } catch (error) {
      console.error(`[Stripe] Failed to apply founding member discount:`, error);
      return false;
    }
  }

  async removeFoundingMemberDiscount(subscriptionId: string): Promise<boolean> {
    const stripe = await getUncachableStripeClient();
    
    try {
      await stripe.subscriptions.update(subscriptionId, {
        discounts: [],
      });
      console.log(`[Stripe] Removed founding member discount from subscription ${subscriptionId}`);
      return true;
    } catch (error) {
      console.error(`[Stripe] Failed to remove founding member discount:`, error);
      return false;
    }
  }

  async createCustomerPortalSession(customerId: string, returnUrl: string) {
    const stripe = await getUncachableStripeClient();
    return await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
  }

  async cancelSubscription(subscriptionId: string) {
    const stripe = await getUncachableStripeClient();
    return await stripe.subscriptions.cancel(subscriptionId);
  }
}

export const stripeService = new StripeService();
