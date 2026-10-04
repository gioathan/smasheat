import { notFound } from "next/navigation";
import { getMenu } from "@/lib/data/menu";
import { MenuItemForm } from "@/components/admin/MenuItemForm";
import { updateMenuItem } from "../../../actions";

export default async function EditMenuItemPage(
  props: PageProps<"/admin/menu/items/[id]/edit">
) {
  const { id } = await props.params;
  const categories = await getMenu();
  const category = categories.find((c) => c.menu_items.some((i) => i.id === id));
  const item = category?.menu_items.find((i) => i.id === id);

  if (!category || !item) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink-900">Edit menu item</h1>
      <div className="mt-6">
        <MenuItemForm
          category={category}
          item={item}
          action={updateMenuItem.bind(null, id)}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
