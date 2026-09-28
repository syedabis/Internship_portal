export const ADMIN_EMAILS = [
  'abis@datacrumbs.org',
  'admin@datacrumbs.org',
  'aun@datacrumbs.org',
];

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}
