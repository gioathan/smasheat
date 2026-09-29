import Image from "next/image";
import { getGalleryImages } from "@/lib/data/gallery";
import { GalleryUploader } from "@/components/admin/GalleryUploader";
import { deleteGalleryImage, moveGalleryImage } from "./actions";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink-900">Gallery</h1>

      <div className="mt-6">
        <GalleryUploader />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, i) => (
          <div
            key={image.id}
            className="overflow-hidden rounded-xl border border-ink-900/10 bg-white"
          >
            <div className="relative aspect-square">
              <Image src={image.url} alt={image.alt_text ?? ""} fill className="object-cover" />
            </div>
            <div className="flex items-center justify-between gap-2 p-2">
              <div className="flex gap-1">
                <form action={moveGalleryImage.bind(null, image.id, "up")}>
                  <button
                    type="submit"
                    disabled={i === 0}
                    className="rounded px-2 py-1 text-sm text-ink-600 hover:bg-ink-900/5 disabled:opacity-30"
                  >
                    ↑
                  </button>
                </form>
                <form action={moveGalleryImage.bind(null, image.id, "down")}>
                  <button
                    type="submit"
                    disabled={i === images.length - 1}
                    className="rounded px-2 py-1 text-sm text-ink-600 hover:bg-ink-900/5 disabled:opacity-30"
                  >
                    ↓
                  </button>
                </form>
              </div>
              <form action={deleteGalleryImage.bind(null, image.id, image.image_path)}>
                <button
                  type="submit"
                  className="text-sm font-medium text-ink-600 hover:text-red-600"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
