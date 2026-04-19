// POST /api/consult — consultant inquiry handler
// Validates → Supabase insert → Resend email → 302 to Calendly
//
// TODO(phase-11-credentials): set the following env vars before going live:
//   SUPABASE_URL          — your Supabase project URL
//   SUPABASE_SERVICE_KEY  — service-role key (never the anon key)
//   RESEND_API_KEY        — from resend.com dashboard
//   NICK_INQUIRY_EMAIL    — destination address for inquiry notifications
//   CALENDLY_URL          — e.g. https://calendly.com/nickk/30min

export const prerender = false;

import type { APIRoute } from 'astro';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// ── Validation schema ─────────────────────────────────────────────────────────

const InquirySchema = z.object({
  name:         z.string().min(1, 'Name is required').max(120),
  email:        z.string().email('Valid email required'),
  company:      z.string().max(120).optional().transform(v => v?.trim() || undefined),
  use_case:     z.string().min(10, 'Please describe your use case (10+ chars)').max(2000),
  utm_source:   z.string().max(100).optional(),
  utm_medium:   z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
});

type Inquiry = z.infer<typeof InquirySchema>;

// ── Env helpers ───────────────────────────────────────────────────────────────

function requireEnv(key: string): string {
  const val = import.meta.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

function getCalendlyUrl(): string {
  return import.meta.env.CALENDLY_URL ?? 'https://calendly.com/nickk';
}

// ── Supabase insert ───────────────────────────────────────────────────────────

async function insertInquiry(data: Inquiry): Promise<void> {
  const supabase = createClient(
    requireEnv('SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_KEY'),
    { auth: { persistSession: false } },
  );

  const { error } = await supabase.from('consultant_inquiries').insert({
    name:         data.name,
    email:        data.email,
    company:      data.company ?? null,
    use_case:     data.use_case,
    utm_source:   data.utm_source ?? null,
    utm_medium:   data.utm_medium ?? null,
    utm_campaign: data.utm_campaign ?? null,
  });

  if (error) {
    // Log server-side; don't expose DB details to the client.
    console.error('[consult] Supabase insert error:', error.message);
    throw new Error('db_insert_failed');
  }
}

// ── Resend notification ───────────────────────────────────────────────────────

async function sendNotification(data: Inquiry): Promise<void> {
  const resend    = new Resend(requireEnv('RESEND_API_KEY'));
  const toEmail   = requireEnv('NICK_INQUIRY_EMAIL');
  const utmLine   = [data.utm_source, data.utm_medium, data.utm_campaign]
    .filter(Boolean).join(' / ') || '(direct)';

  const { error } = await resend.emails.send({
    from:    'withagents.dev <noreply@withagents.dev>',
    to:      toEmail,
    subject: `New consulting inquiry from ${data.name}`,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
      ${data.company ? `<p><strong>Company:</strong> ${escapeHtml(data.company)}</p>` : ''}
      <p><strong>Use case:</strong></p>
      <blockquote style="border-left:3px solid #8B5CF6;padding-left:12px;color:#71717A;">
        ${escapeHtml(data.use_case).replace(/\n/g, '<br />')}
      </blockquote>
      <p><strong>UTM:</strong> ${escapeHtml(utmLine)}</p>
      <hr />
      <p style="color:#71717A;font-size:12px;">Sent via withagents.dev /work form</p>
    `,
  });

  if (error) {
    // Non-fatal: inquiry is already in Supabase. Log and continue.
    console.error('[consult] Resend send error:', error.message);
  }
}

// ── HTML escape (no external dep needed) ─────────────────────────────────────

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── Route handler ─────────────────────────────────────────────────────────────

export const POST: APIRoute = async ({ request }) => {
  // 1. Parse form body
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  const raw = {
    name:         formData.get('name'),
    email:        formData.get('email'),
    company:      formData.get('company') || undefined,
    use_case:     formData.get('use_case'),
    utm_source:   formData.get('utm_source') || undefined,
    utm_medium:   formData.get('utm_medium') || undefined,
    utm_campaign: formData.get('utm_campaign') || undefined,
  };

  // 2. Server-side validation
  const result = InquirySchema.safeParse(raw);
  if (!result.success) {
    const firstError = result.error.issues[0]?.message ?? 'Invalid input';
    // Redirect back with error param so the form can surface it
    const referer = request.headers.get('referer') ?? '/work';
    const errorUrl = new URL(referer);
    errorUrl.searchParams.set('error', firstError);
    return Response.redirect(errorUrl.toString(), 303);
  }

  const data = result.data;

  // 3. Supabase insert
  try {
    await insertInquiry(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
    console.error('[consult] Fatal error during insert:', msg);
    // Redirect to /work?error=... rather than a blank 500
    return Response.redirect(
      `/work?error=${encodeURIComponent('Something went wrong. Please try again or email directly.')}`,
      303,
    );
  }

  // 4. Send notification email (non-fatal)
  await sendNotification(data);

  // 5. Redirect to Calendly
  return Response.redirect(getCalendlyUrl(), 303);
};
