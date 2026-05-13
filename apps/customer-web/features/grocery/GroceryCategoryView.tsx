export default function GroceryCategoryView({
  slug,
  filters,
}: {
  slug: string;
  filters: Record<string, string | undefined>;
}) {
  return (
    <div className="container-app py-12 text-center">
      <h1 className="text-2xl font-bold">Category: {slug}</h1>
      <p className="text-gray-500 mt-2">Coming in Section 4</p>
    </div>
  );
}