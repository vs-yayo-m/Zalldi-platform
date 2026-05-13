"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@zalldi/auth";
import { loginSchema } from "@zalldi/validation";
import { Button, Input } from "@zalldi/ui";

export default function SellerLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) { setError(result.error.issues[0]?.message ?? "Invalid input"); return; }

    setLoading(true);
    try {
      const supabase = createBrowserClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: result.data.email,
        password: result.data.password,
      });
      if (authError) { setError(authError.message); return; }

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profile?.role !== "seller" && profile?.role !== "admin") {
        await supabase.auth.signOut();
        setError("Access denied. Seller account required.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch { setError("Something went wrong. Try again."); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seller@example.com" required />
      <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
      {error && <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600">{error}</div>}
      <Button type="submit" loading={loading} className="w-full mt-1" size="lg">
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
