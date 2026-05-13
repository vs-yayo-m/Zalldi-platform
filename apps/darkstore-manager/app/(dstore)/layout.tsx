import { redirect } from "next/navigation";
import { createClient } from "@zalldi/auth/server";
import DstoreShell from "@/components/layout/DstoreShell";

export default async function DstoreLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const allowedRoles = ["admin", "seller"];
  if (!profile?.role || !allowedRoles.includes(profile.role)) {
    redirect("/login?error=unauthorized");
  }

  return <DstoreShell user={user}>{children}</DstoreShell>;
}
