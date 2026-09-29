import Link from "next/link";

const cards = [
  { href: "/admin/menu", title: "Menu", description: "Edit categories, items, prices and availability." },
  { href: "/admin/business-info", title: "Business info & hours", description: "Phone, address, links and weekly hours." },
  { href: "/admin/hours-overrides", title: "Holiday hours", description: "One-off closures or schedule changes." },
  { href: "/admin/gallery", title: "Gallery", description: "Upload and reorder photos." },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink-900">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-600">
        Changes here go live on the public site within a few seconds.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="font-display font-bold text-ink-900">{card.title}</p>
            <p className="mt-1 text-sm text-ink-600">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
