import { OrderTrackingView } from "@/features/orders";

interface Props {
  params: Promise < { id: string } > ;
}

export default async function OrderTrackingPage({ params }: Props) {
  const { id } = await params;
  return <OrderTrackingView id={id} />;
}