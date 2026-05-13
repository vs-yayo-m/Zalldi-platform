"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@zalldi/ui";
import { loginSchema } from "@zalldi/validation";
import { createBrowserClient } from "@zalldi/auth";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setLoading(true);
    try {
      const supabase = createBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: result.data.email,
        password: result.data.password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      const params = new URLSearchParams(window.location.search);
      router.push(params.get("redirect") ?? "/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <Button type="submit" loading={loading} className="w-full mt-1" size="lg">
        {loading ? "Signing in..." : "Sign In"}
      </Button>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs text-gray-400 bg-white px-2">OR</div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={async () => {
          const supabase = createBrowserClient();
          await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/api/auth/callback` },
          });
        }}
      >
        <span>🔵</span> Continue with Google
      </Button>
    </form>
  );
}
