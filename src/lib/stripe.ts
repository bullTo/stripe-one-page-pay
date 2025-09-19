import { loadStripe } from '@stripe/stripe-js';

// Your Stripe publishable key
const stripePublishableKey = 'pk_test_51R1rYZEPUe4GfW8Trz6WqS4aRxE6P2OhZIlzqQrVksZVWFWCKpgpY5BPQoWTmybWHIoKFYAbe2KxSfOOj9VGs4Cm00HwVsRnOE';

// Initialize Stripe
export const stripePromise = loadStripe(stripePublishableKey);