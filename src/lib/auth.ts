// Optional allow-list restricting who can use /admin, regardless of sign-in
// method (password or Google). Set ADMIN_ALLOWED_EMAILS as a comma-separated
// list in .env.local; leave it unset to keep today's behavior (any account
// that exists in Supabase Auth for this project can sign in).
const allowList = process.env.ADMIN_ALLOWED_EMAILS
  ? process.env.ADMIN_ALLOWED_EMAILS.split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  : null;

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!allowList || allowList.length === 0) return true;
  return !!email && allowList.includes(email.toLowerCase());
}
