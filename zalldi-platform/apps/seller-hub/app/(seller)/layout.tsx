import { redirect } from "next/navigation";
import { createClient } from "@zalldi/auth/server";
import SellerShell from "@/components/layout/SellerShell";

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "seller" && profile?.role !== "admin") redirect("/login?error=unauthorized");

  return <SellerShell user={user}>{children}</SellerShell>;
}
