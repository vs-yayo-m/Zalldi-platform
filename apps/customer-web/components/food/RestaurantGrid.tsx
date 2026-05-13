import Link from "next/link";
import type { Restaurant } from "@zalldi/types";
import { EmptyState } from "@zalldi/ui";

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link href={`/food/restaurant/${restaurant.slug}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5">
        <div className="relative h-44 bg-gray-100">
          {restaurant.cover_url ? (
            <img src={restaurant.cover_url} alt={restaurant.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl bg-orange-50">🍽️</div>
          )}
          {!restaurant.is_open && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-gray-800 font-semibold text-sm px-3 py-1 rounded-full">
                Opens at {restaurant.opens_at ?? "11:00"}
              </span>
            </div>
          )}
          {restaurant.delivery_fee === 0 && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              FREE DELIVERY
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-gray-900 text-base leading-tight group-hover:text-orange-500 transition-colors">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-0.5 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded text-xs font-bold text-green-700 shrink-0">
              ⭐ {restaurant.rating.toFixed(1)}
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-1 line-clamp-1">{restaurant.cuisine_types.join(" • ")}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span>🕐 {restaurant.avg_delivery_time_mins} min</span>
            <span>·</span>
            <span>Min ₹{restaurant.min_order_amount}</span>
            {restaurant.is_pure_veg && (
              <>
                <span>·</span>
                <span className="text-green-600 font-medium">Pure Veg</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function RestaurantCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}

interface Props {
  restaurants: Restaurant[];
  loading?: boolean;
}

export default function RestaurantGrid({ restaurants, loading }: Props) {
  if (loading) {
    return (
      <div>
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <RestaurantCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <EmptyState
        icon="🍽️"
        title="No restaurants found"
        description="We're expanding to your area soon. Try changing your location or filters."
      />
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {restaurants.length} restaurant{restaurants.length !== 1 ? "s" : ""} near you
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {restaurants.map((r) => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
      </div>
    </div>
  );
}
