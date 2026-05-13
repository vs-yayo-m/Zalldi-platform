import Link from "next/link";
import type { Category } from "@zalldi/types";

const EMOJI_MAP: Record<string, string> = {
  vegetables: "🥦",
  fruits: "🍎",
  dairy: "🥛",
  bakery: "🍞",
  snacks: "🍿",
  beverages: "🧃",
  meat: "🥩",
  seafood: "🐟",
  frozen: "🧊",
  personal: "🧴",
  cleaning: "🧹",
  baby: "👶",
};

function getEmoji(slug: string) {
  const key = Object.keys(EMOJI_MAP).find((k) => slug.includes(k));
  return key ? EMOJI_MAP[key] : "🛒";
}

export default function CategoryScroll({ categories }: { categories: Category[] }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Shop by Category</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/groceries/category/${cat.slug}`}
            className="shrink-0 flex flex-col items-center gap-2 w-20"
          >
            <div className="w-16 h-16 rounded-2xl bg-gray-100 hover:bg-green-50 border border-gray-200 hover:border-green-300 flex items-center justify-center text-2xl transition-all hover:scale-105">
              {cat.image_url ? (
                <img src={cat.image_url} alt={cat.name} className="w-10 h-10 object-contain" />
              ) : (
                getEmoji(cat.slug)
              )}
            </div>
            <span className="text-xs text-center text-gray-700 font-medium leading-tight line-clamp-2">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
