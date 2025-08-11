import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@payments/services/stripe.service';
import Stripe from 'stripe';
import { handleStripeWebhook } from '@payments/webhooks/stripe.webhook';

// Webhook für Stripe Events (Subscription Updates, Payments, etc.)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  if (!stripe) {
    return res.status(500).json({ error: 'Stripe is not configured' });
  }

  let event: Stripe.Event;

  try {
    // Webhook Signature verifizieren
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  try {
    await handleStripeWebhook(event);
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Error processing webhook' });
  }
}

// Wichtig: Raw body für Stripe Webhook Verification
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}
