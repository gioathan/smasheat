import { getMenu } from "@/lib/data/menu";
import { MenuItemForm } from "@/components/admin/MenuItemForm";
import { createMenuItem } from "../../actions";

export default async function NewMenuItemPage(
  props: PageProps<"/admin/menu/items/new">
) {
  const searchParams = await props.searchParams;
  const categories = await getMenu();
  const categoryParam = searchParams.category;
  const defaultCategoryId = Array.isArray(categoryParam)
    ? categoryParam[0]
    : categoryParam;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink-900">Add menu item</h1>
      <div className="mt-6">
        <MenuItemForm
          categories={categories}
          defaultCategoryId={defaultCategoryId}
          action={createMenuItem}
          submitLabel="Add item"
        />
      </div>
    </div>
  );
}
