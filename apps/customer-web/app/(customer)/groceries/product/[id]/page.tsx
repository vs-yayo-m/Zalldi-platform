import { GroceryProductView } from "@/features/grocery";

interface Props {
  params: Promise < { id: string } > ;
}

export default async function GroceryProductPage({ params }: Props) {
  const { id } = await params;
  return <GroceryProductView id={id} />;
}