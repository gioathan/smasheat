import Link from "next/link";
import { getMenu } from "@/lib/data/menu";
import { formatPrice } from "@/lib/utils";
import {
  deleteMenuItem,
  moveMenuItem,
  renameCategory,
  toggleAvailability,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const categories = await getMenu();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink-900">Menu</h1>
      </div>

      <div className="mt-6 space-y-10">
        {categories.map((category) => (
          <div key={category.id}>
            <div className="flex items-center justify-between gap-3">
              <form
                action={renameCategory.bind(null, category.id)}
                className="flex items-center gap-2"
              >
                <input
                  name="name"
                  defaultValue={category.name}
                  className="rounded-lg border border-ink-900/15 px-2 py-1 font-display font-bold text-ink-900"
                />
                <button
                  type="submit"
                  className="text-xs font-medium text-brand-600 hover:underline"
                >
                  Save name
                </button>
              </form>
              <Link
                href={`/admin/menu/items/new?category=${category.id}`}
                className="rounded-full bg-brand-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-600"
              >
                + Add item
              </Link>
            </div>

            <div className="mt-3 overflow-x-auto rounded-xl border border-ink-900/10 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-ink-900/10 text-ink-600">
                  <tr>
                    <th className="px-4 py-2 font-medium">Name</th>
                    <th className="px-4 py-2 font-medium">Price</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium">Order</th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {category.menu_items.map((item, i) => (
                    <tr key={item.id} className="border-b border-ink-900/5 last:border-0">
                      <td className="px-4 py-3 font-medium text-ink-900">{item.name}</td>
                      <td className="px-4 py-3 text-ink-600">{formatPrice(item.price_cents)}</td>
                      <td className="px-4 py-3">
                        <form action={toggleAvailability.bind(null, item.id, item.is_available)}>
                          <button
                            type="submit"
                            className={
                              item.is_available
                                ? "rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                                : "rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700"
                            }
                          >
                            {item.is_available ? "Available" : "Sold out"}
                          </button>
                        </form>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <form action={moveMenuItem.bind(null, item.id, category.id, "up")}>
                            <button
                              type="submit"
                              disabled={i === 0}
                              className="rounded px-2 py-1 text-ink-600 hover:bg-ink-900/5 disabled:opacity-30"
                            >
                              ↑
                            </button>
                          </form>
                          <form action={moveMenuItem.bind(null, item.id, category.id, "down")}>
                            <button
                              type="submit"
                              disabled={i === category.menu_items.length - 1}
                              className="rounded px-2 py-1 text-ink-600 hover:bg-ink-900/5 disabled:opacity-30"
                            >
                              ↓
                            </button>
                          </form>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/admin/menu/items/${item.id}/edit`}
                            className="font-medium text-brand-600 hover:underline"
                          >
                            Edit
                          </Link>
                          <form action={deleteMenuItem.bind(null, item.id)}>
                            <button
                              type="submit"
                              className="font-medium text-ink-600 hover:text-red-600"
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
