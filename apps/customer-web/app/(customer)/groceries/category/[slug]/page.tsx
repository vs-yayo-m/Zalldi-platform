import { GroceryCategoryView } from "@/features/grocery";

interface Props {
  params: Promise < { slug: string } > ;
  searchParams: Promise < { sort ? : string;brand ? : string } > ;
}

export default async function GroceryCategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const filters = await searchParams;
  return <GroceryCategoryView slug={slug} filters={filters} />;
}