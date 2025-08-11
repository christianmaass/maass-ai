/**
 * payments/webhooks/stripe.webhook.ts
 * Central Stripe webhook handler (pure function). Should be used by Next.js API route
 * or App Router handler. Keeps business logic here, route only handles HTTP specifics.
 */

import type Stripe from 'stripe';

export interface WebhookResult {
  ok: boolean;
}

export async function handleStripeWebhook(event: Stripe.Event): Promise<WebhookResult> {
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Payment successful:', session.id);
        // TODO: User Plan in Datenbank aktualisieren
        // await updateUserSubscription(session.customer_email, session.subscription);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription updated:', subscription.id);
        // TODO: Subscription Status aktualisieren
        break;
      }

      case 'customer.subscription.deleted': {
        const deletedSubscription = event.data.object as Stripe.Subscription;
        console.log('Subscription cancelled:', deletedSubscription.id);
        // TODO: User auf Free Plan zurücksetzen
        break;
      }

      case 'invoice.payment_failed': {
        const failedInvoice = event.data.object as Stripe.Invoice;
        console.log('Payment failed:', failedInvoice.id);
        // TODO: User benachrichtigen über fehlgeschlagene Zahlung
        break;
      }

      default: {
        console.log(`Unhandled event type: ${event.type}`);
      }
    }

    return { ok: true };
  } catch (err) {
    console.error('Error in handleStripeWebhook:', err);
    throw err;
  }
}
