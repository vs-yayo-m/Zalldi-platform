import { redirect } from "next/navigation";
import { createClient } from "@zalldi/auth/server";
import AdminShell from "@/components/layout/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Verify admin role server-side
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/login?error=unauthorized");

  return <AdminShell user={user}>{children}</AdminShell>;
}
