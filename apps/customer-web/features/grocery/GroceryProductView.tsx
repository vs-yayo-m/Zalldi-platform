export default function GroceryProductView({ id }: { id: string }) {
  return (
    <div className="container-app py-12 text-center">
      <h1 className="text-2xl font-bold">Product: {id}</h1>
      <p className="text-gray-500 mt-2">Coming in Section 5</p>
    </div>
  );
}