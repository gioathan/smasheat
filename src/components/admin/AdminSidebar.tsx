import Link from "next/link";
import { logout } from "@/app/admin/actions";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/menu", label: "Menu" },
  { href: "/admin/business-info", label: "Business info & hours" },
  { href: "/admin/hours-overrides", label: "Holiday hours" },
  { href: "/admin/gallery", label: "Gallery" },
];

export function AdminSidebar() {
  return (
    <aside className="w-full shrink-0 border-b border-ink-900/10 bg-white sm:w-56 sm:border-b-0 sm:border-r sm:min-h-screen">
      <div className="p-5">
        <p className="font-display font-bold text-ink-900">Smasheat admin</p>
      </div>
      <nav className="flex flex-row gap-1 overflow-x-auto px-3 pb-3 sm:flex-col sm:pb-0">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-ink-800 hover:bg-brand-50 hover:text-brand-600"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <form action={logout} className="p-3">
        <button
          type="submit"
          className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-ink-600 hover:bg-ink-900/5"
        >
          Sign out
        </button>
      </form>
    </aside>
  );
}
