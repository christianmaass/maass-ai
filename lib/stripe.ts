import { loadStripe } from '@stripe/stripe-js';

// Stripe Publishable Key aus Environment Variables
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined in environment variables');
}

// Stripe Client-Side Instanz
export const stripePromise = loadStripe(stripePublishableKey);

// Stripe Server-Side (für API Routes)
import Stripe from 'stripe';

// Server-Side Stripe-Instanz (nur für API-Routes)
// Diese wird nur auf dem Server ausgeführt, niemals im Browser
let serverStripe: Stripe | null = null;

if (typeof window === 'undefined') {
  // Nur auf dem Server ausführen
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (stripeSecretKey) {
    serverStripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-06-30.basil',
    });
  }
}

export const stripe = serverStripe;
