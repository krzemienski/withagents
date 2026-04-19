import { z } from 'zod';

export const inquirySchema = z.object({
  name:     z.string().trim().min(1, 'Name required').max(120),
  email:    z.string().trim().toLowerCase().email('Valid email required').max(200),
  company:  z.string().trim().max(160).optional().or(z.literal('')),
  problem:  z.string().trim().min(20, 'Tell me a bit more — 20 chars minimum').max(4000),
  budget:   z.enum(['<10k', '10-25k', '25-50k', '50-100k', '100k+', 'unsure']).optional(),
  timeline: z.enum(['this-month', '1-3-months', '3-6-months', 'exploring']).optional(),

  // Attribution (hidden fields captured from URL on page load)
  utm_source:   z.string().trim().max(120).optional().or(z.literal('')),
  utm_medium:   z.string().trim().max(120).optional().or(z.literal('')),
  utm_campaign: z.string().trim().max(120).optional().or(z.literal('')),
  utm_content:  z.string().trim().max(120).optional().or(z.literal('')),
  utm_term:     z.string().trim().max(120).optional().or(z.literal('')),
  referrer:     z.string().trim().max(500).optional().or(z.literal('')),

  // Honeypot — must be empty. Bots fill it.
  website: z.string().max(0).optional().or(z.literal('')),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
