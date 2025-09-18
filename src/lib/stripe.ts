import { loadStripe } from '@stripe/stripe-js';

// Your Stripe publishable key
const stripePublishableKey = 'pk_live_51QnUM2HVyfZo0kmXGuR9WwgU03Ti2XBqZySYuFCl7DzwEEw9T4pBx2Qt6E16SSx3HOxfRgYObKUMtqSlKmGZwLro00KGDNxf6t';

// Initialize Stripe
export const stripePromise = loadStripe(stripePublishableKey);