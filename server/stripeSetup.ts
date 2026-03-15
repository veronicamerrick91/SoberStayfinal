import { getUncachableStripeClient } from './stripeClient';

const PRODUCTS = [
  {
    name: 'Sober Stay Provider Listing',
    searchName: 'Provider',
    price: 4900,
    interval: 'month' as const,
  },
  {
    name: 'Featured Listing',
    searchName: 'Featured',
    price: 10000,
    interval: 'month' as const,
  },
  {
    name: 'Verified Badge',
    searchName: 'Verified',
    price: 1500,
    interval: 'month' as const,
  },
];

const COUPONS = [
  {
    id: 'FOUNDING_MEMBER_50',
    percentOff: 50,
    duration: 'forever' as const,
    name: 'Founding Member - 50% Off Forever',
  },
  {
    id: 'R2EWiPIP',
    percentOff: 50,
    duration: 'once' as const,
    name: 'Referral - 50% Off First Month',
  },
];

export async function ensureStripeProductsExist() {
  try {
    const stripe = await getUncachableStripeClient();
    console.log('[Stripe Setup] Checking for required products and coupons...');

    for (const product of PRODUCTS) {
      const existing = await stripe.products.search({
        query: `name~'${product.searchName}' AND active:'true'`,
      });

      let hasValidPrice = false;
      for (const p of existing.data) {
        const prices = await stripe.prices.list({ product: p.id, active: true });
        const match = prices.data.find(
          (pr) => pr.recurring?.interval === product.interval && pr.unit_amount === product.price
        );
        if (match) {
          hasValidPrice = true;
          console.log(`[Stripe Setup] Found "${product.name}" with price ${match.id}`);
          break;
        }
      }

      if (!hasValidPrice) {
        console.log(`[Stripe Setup] Creating "${product.name}"...`);
        const newProduct = await stripe.products.create({ name: product.name });
        const newPrice = await stripe.prices.create({
          product: newProduct.id,
          unit_amount: product.price,
          currency: 'usd',
          recurring: { interval: product.interval },
        });
        console.log(`[Stripe Setup] Created "${product.name}" (${newProduct.id}) with price ${newPrice.id}`);
      }
    }

    for (const coupon of COUPONS) {
      try {
        await stripe.coupons.retrieve(coupon.id);
        console.log(`[Stripe Setup] Coupon "${coupon.id}" exists`);
      } catch (error: any) {
        if (error.code === 'resource_missing') {
          console.log(`[Stripe Setup] Creating coupon "${coupon.id}"...`);
          await stripe.coupons.create({
            id: coupon.id,
            percent_off: coupon.percentOff,
            duration: coupon.duration,
            name: coupon.name,
          });
          console.log(`[Stripe Setup] Created coupon "${coupon.id}"`);
        }
      }
    }

    console.log('[Stripe Setup] All products and coupons verified.');
  } catch (error) {
    console.error('[Stripe Setup] Error ensuring products exist:', error);
  }
}
