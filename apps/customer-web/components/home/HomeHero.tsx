export default function HomeHero() {
  return (
    <section className="bg-gradient-to-br from-orange-50 via-white to-amber-50 border-b border-orange-100">
      <div className="container-app py-16 md:py-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
            Now delivering in your area
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-4">
            Everything you need,
            <span className="text-orange-500 block">delivered fast.</span>
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-lg">
            Order from your favourite restaurants, get groceries in minutes, or book a table — all in one place.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="/food"
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              🍕 Order Food
            </a>
            <a
              href="/groceries"
              className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-semibold px-6 py-3 rounded-xl border border-gray-200 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              🛒 Shop Groceries
            </a>
          </div>

          <div className="flex items-center gap-6 mt-10">
            <div className="text-center">
              <div className="text-2xl font-black text-gray-900">15 min</div>
              <div className="text-xs text-gray-500 mt-0.5">Avg delivery</div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <div className="text-2xl font-black text-gray-900">500+</div>
              <div className="text-xs text-gray-500 mt-0.5">Restaurants</div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <div className="text-2xl font-black text-gray-900">5000+</div>
              <div className="text-xs text-gray-500 mt-0.5">Products</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
