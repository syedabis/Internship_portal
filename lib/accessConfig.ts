import { isAdminEmail } from './adminAuth';

/**
 * Selective email list of authorized beta testers.
 */
export const TESTER_EMAILS = new Set([
  "aun@datacrumbs.org",
  "abis@datacrumbs.org",
  "cursor_3@datacrumbs.org",
  "shaharyar@datacrumbs.org",
  "cursor@datacrumbs.org",
  "admin@datacrumbs.org",
  "zoya@datacrumbs.org",
]);

export const BUILDER_ACCESS_EMAILS = TESTER_EMAILS;

/**
 * Restricted beta features hidden from normal users and reserved for testers & admins.
 */
export const RESTRICTED_BETA_FEATURES = new Set([
  "resources",
  "inbox",
  "jobopportunities",
  "projects",
  "leaderboard",
  "linkedinaudit",
  "cvaudit",
]);

/**
 * Single source of truth for feature access authorization.
 */
export function isFeatureAllowedForUser(
  userEmail: string | undefined | null,
  featureId: string
): boolean {
  if (!RESTRICTED_BETA_FEATURES.has(featureId)) {
    return true;
  }

  if (!userEmail) return false;
  const normalized = userEmail.toLowerCase().trim();

  if (isAdminEmail(normalized)) return true;

  const envTesters = (process.env.NEXT_PUBLIC_TESTER_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (envTesters.includes(normalized)) return true;

  return TESTER_EMAILS.has(normalized);
}

