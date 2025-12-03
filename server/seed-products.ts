import { getUncachableStripeClient } from './stripeClient';

async function createProducts() {
  const stripe = await getUncachableStripeClient();

  // Check if product already exists
  const existingProducts = await stripe.products.search({ 
    query: "name:'Provider Monthly Subscription'" 
  });
  
  if (existingProducts.data.length > 0) {
    console.log('Provider Monthly Subscription already exists');
    console.log('Product ID:', existingProducts.data[0].id);
    
    // Get the price for this product
    const prices = await stripe.prices.list({
      product: existingProducts.data[0].id,
      active: true,
    });
    
    if (prices.data.length > 0) {
      console.log('Price ID:', prices.data[0].id);
      console.log('Amount:', prices.data[0].unit_amount / 100, prices.data[0].currency.toUpperCase());
    }
    return;
  }

  // Create product
  const product = await stripe.products.create({
    name: 'Provider Monthly Subscription',
    description: 'Monthly subscription for housing providers to list properties on Sober Stay',
    metadata: {
      type: 'provider_subscription',
    },
  });

  // Create monthly price - $49/month
  const monthlyPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 4900, // $49.00
    currency: 'usd',
    recurring: { interval: 'month' },
  });

  console.log('Created Product:', product.id);
  console.log('Created Price:', monthlyPrice.id);
  console.log('Amount: $49.00/month');
  console.log('\nCopy this Price ID to use in your checkout flow:', monthlyPrice.id);
}

createProducts()
  .then(() => console.log('\nDone!'))
  .catch(err => console.error('Error:', err));
