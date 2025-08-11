/**
 * payments/services/stripe.service.ts
 * Centralized Stripe client/server exports for the Payments domain.
 *
 * Client: export `stripePromise` using NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
 * Server: export `stripe` (Stripe instance) using STRIPE_SECRET_KEY, guarded to run only on server.
 */

import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

// Client-side publishable key
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined in environment variables');
}

// Exported for client usage (PaymentModal, etc.)
export const stripePromise = loadStripe(stripePublishableKey);

// Server-side Stripe instance (never runs in the browser)
let serverStripe: Stripe | null = null;

if (typeof window === 'undefined') {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (stripeSecretKey) {
    serverStripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-07-30.basil',
    });
  }
}

export const stripe = serverStripe;
