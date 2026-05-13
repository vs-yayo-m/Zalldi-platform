import Link from "next/link";

const verticals = [
  {
    id: "food",
    href: "/food",
    emoji: "🍕",
    title: "Food Delivery",
    description: "Restaurants & cafes near you",
    color: "from-orange-50 to-red-50",
    border: "border-orange-200 hover:border-orange-400",
    badge: "30-45 min",
    badgeColor: "bg-orange-100 text-orange-700",
  },
  {
    id: "groceries",
    href: "/groceries",
    emoji: "🛒",
    title: "Groceries",
    description: "Fresh produce, dairy & essentials",
    color: "from-green-50 to-emerald-50",
    border: "border-green-200 hover:border-green-400",
    badge: "10-20 min",
    badgeColor: "bg-green-100 text-green-700",
  },
  {
    id: "dineout",
    href: "/dineout",
    emoji: "🍽️",
    title: "Dine Out",
    description: "Reserve tables at top restaurants",
    color: "from-purple-50 to-pink-50",
    border: "border-purple-200 hover:border-purple-400",
    badge: "Book now",
    badgeColor: "bg-purple-100 text-purple-700",
  },
];

export default function VerticalSwitcher() {
  return (
    <section className="container-app py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">What are you craving?</h2>
      <p className="text-gray-500 mb-8">Choose your experience</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {verticals.map((v) => (
          <Link
            key={v.id}
            href={v.href}
            className={`group flex flex-col p-6 rounded-2xl bg-gradient-to-br ${v.color} border-2 ${v.border} transition-all hover:shadow-lg hover:-translate-y-1`}
          >
            <div className="text-4xl mb-4">{v.emoji}</div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{v.title}</h3>
                <p className="text-gray-500 text-sm mt-0.5">{v.description}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${v.badgeColor}`}>
                {v.badge}
              </span>
              <span className="text-gray-400 group-hover:translate-x-1 transition-transform text-lg">→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
