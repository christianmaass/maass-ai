// Shared types for the payments domain

export type PlanId = 'free' | 'starter' | 'pro' | 'enterprise';

export interface InvoiceSummary {
  id: string;
  amount: number; // in cents
  currency: string;
  status: 'paid' | 'open' | 'uncollectible' | 'void';
  hostedInvoiceUrl?: string | null;
  createdAt: string; // ISO
}
