/**
 * Robust Email Validator
 * 
 * Validates email format following RFC 5322 standards (simplified for performance).
 * Combines logical checks with a lightweight regex — NOT regex-only.
 * Includes a disposable/temporary email domain blocklist.
 */

// ── Disposable / Temporary Email Blocklist ──
// Extend this set with additional domains as needed.
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  'guerrillamail.com',
  'throwaway.email',
  'yopmail.com',
  'sharklasers.com',
  'guerrillamailblock.com',
  'grr.la',
  'dispostable.com',
  'trashmail.com',
  'fakeinbox.com',
  'tempail.com',
  'temp-mail.org',
  'minutemail.com',
  'maildrop.cc',
  'mailnesia.com',
  'jetable.org',
  'mohmal.com',
  'getnada.com',
  'emailondeck.com',
]);

interface EmailValidationResult {
  valid: boolean;
  error: string;
  /** Normalized email (trimmed, domain lowercased) — use this for submission */
  normalized: string;
}

/**
 * Validate an email address with production-grade checks.
 * 
 * Steps:
 * 1. Trim & normalize (lowercase domain)
 * 2. Length constraints (total ≤ 254, local ≤ 64)
 * 3. Structural check (exactly one @, non-empty parts)
 * 4. Local part rules (allowed chars, no consecutive/leading/trailing dots)
 * 5. Domain rules (at least one dot, valid labels, TLD ≥ 2 chars)
 * 6. Disposable domain check
 */
export function validateEmail(rawEmail: string): EmailValidationResult {
  const fail = (error: string): EmailValidationResult => ({ valid: false, error, normalized: '' });

  // ── Step 1: Trim whitespace ──
  const trimmed = rawEmail.trim();
  if (!trimmed) {
    return fail('Email address is required.');
  }

  // Check for leading/trailing spaces in the original input (user awareness)
  if (rawEmail !== trimmed) {
    // We auto-fix this, but still worth noting internally. Proceed with trimmed.
  }

  // ── Step 2: Length constraints ──
  if (trimmed.length > 254) {
    return fail('Email address is too long (max 254 characters).');
  }

  // ── Step 3: Structural check — exactly one @ ──
  const atCount = (trimmed.match(/@/g) || []).length;
  if (atCount === 0) {
    return fail('Email must contain an "@" symbol.');
  }
  if (atCount > 1) {
    return fail('Email must contain only one "@" symbol.');
  }

  const atIndex = trimmed.indexOf('@');
  const localPart = trimmed.substring(0, atIndex);
  const domainPart = trimmed.substring(atIndex + 1).toLowerCase();

  // Normalize: keep local as-is, lowercase domain
  const normalized = `${localPart}@${domainPart}`;

  if (!localPart) {
    return fail('Email is missing the username before "@".');
  }
  if (!domainPart) {
    return fail('Email is missing the domain after "@".');
  }

  // Local part length
  if (localPart.length > 64) {
    return fail('The username part is too long (max 64 characters).');
  }

  // ── Step 4: Local part rules ──
  // Allowed characters: letters, digits, . _ % + -
  const localRegex = /^[a-zA-Z0-9._%+-]+$/;
  if (!localRegex.test(localPart)) {
    return fail('Email username contains invalid characters. Only letters, digits, and . _ % + - are allowed.');
  }

  // No leading or trailing dot
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return fail('Email username cannot start or end with a dot.');
  }

  // No consecutive dots
  if (localPart.includes('..')) {
    return fail('Email username cannot contain consecutive dots.');
  }

  // ── Step 5: Domain rules ──
  // Must contain at least one dot
  if (!domainPart.includes('.')) {
    return fail('Email domain must contain at least one dot (e.g. gmail.com).');
  }

  // Split into labels
  const labels = domainPart.split('.');

  // TLD must be at least 2 characters
  const tld = labels[labels.length - 1];
  if (tld.length < 2) {
    return fail('Email has an invalid top-level domain.');
  }

  // Validate each domain label
  const labelRegex = /^[a-zA-Z0-9-]+$/;
  for (const label of labels) {
    if (!label) {
      return fail('Email domain contains empty labels (consecutive dots).');
    }
    if (!labelRegex.test(label)) {
      return fail('Email domain contains invalid characters. Only letters, digits, and hyphens are allowed.');
    }
    if (label.startsWith('-') || label.endsWith('-')) {
      return fail('Email domain labels cannot start or end with a hyphen.');
    }
  }

  // ── Step 6: Disposable domain check ──
  if (DISPOSABLE_DOMAINS.has(domainPart)) {
    return fail('Temporary/disposable email addresses are not allowed. Please use a permanent email.');
  }

  // ✅ All checks passed
  return { valid: true, error: '', normalized };
}
