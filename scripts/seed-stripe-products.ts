import { getUncachableStripeClient } from '../server/stripeClient';

async function createProducts() {
  console.log('Creating Stripe products for Sober Stay Homes...');
  
  const stripe = await getUncachableStripeClient();

  // Check if product already exists
  const existingProducts = await stripe.products.search({ 
    query: "name:'Provider Listing Subscription'" 
  });
  
  if (existingProducts.data.length > 0) {
    console.log('Provider Listing Subscription product already exists');
    console.log('Product ID:', existingProducts.data[0].id);
    
    // Get prices for this product
    const prices = await stripe.prices.list({ 
      product: existingProducts.data[0].id,
      active: true 
    });
    console.log('Prices:', prices.data.map(p => ({ id: p.id, amount: p.unit_amount, interval: p.recurring?.interval })));
    return;
  }

  // Create the product
  const product = await stripe.products.create({
    name: 'Provider Listing Subscription',
    description: 'Metered billing: $49/month per listing slot. Each payment unlocks 1 listing slot for sober living home providers on Sober Stay Homes',
    metadata: {
      type: 'provider_subscription',
    },
  });
  console.log('Created product:', product.id);

  // Create monthly price - $49/month per listing
  const monthlyPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 4900, // $49.00 in cents
    currency: 'usd',
    recurring: { interval: 'month' },
    metadata: {
      plan_type: 'monthly',
    },
  });
  console.log('Created monthly price:', monthlyPrice.id, '- $49/month');

  // Create annual price - $399/year (save $189)
  const annualPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 39900, // $399.00 in cents
    currency: 'usd',
    recurring: { interval: 'year' },
    metadata: {
      plan_type: 'annual',
    },
  });
  console.log('Created annual price:', annualPrice.id, '- $399/year');

  console.log('\nDone! Products and prices created successfully.');
  console.log('\nProduct ID:', product.id);
  console.log('Monthly Price ID:', monthlyPrice.id);
  console.log('Annual Price ID:', annualPrice.id);
}

createProducts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error creating products:', error);
    process.exit(1);
  });
