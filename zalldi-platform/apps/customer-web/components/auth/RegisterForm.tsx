"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@zalldi/ui";
import { registerSchema } from "@zalldi/validation";
import { createBrowserClient } from "@zalldi/auth";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ full_name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const result = registerSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setLoading(true);
    try {
      const supabase = createBrowserClient();
      const { error: authError } = await supabase.auth.signUp({
        email: result.data.email,
        password: result.data.password,
        options: {
          data: {
            full_name: result.data.full_name,
            phone: result.data.phone ?? null,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="text-5xl mb-4">📬</div>
        <h2 className="font-bold text-gray-900 text-lg mb-2">Check your email</h2>
        <p className="text-gray-500 text-sm">
          We sent a confirmation link to <strong>{form.email}</strong>. Click it to activate your account.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="mt-6 text-orange-500 text-sm font-semibold hover:underline"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Full Name"
        placeholder="Priya Sharma"
        value={form.full_name}
        onChange={(e) => update("full_name", e.target.value)}
        autoComplete="name"
        required
      />
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={(e) => update("email", e.target.value)}
        autoComplete="email"
        required
      />
      <Input
        label="Phone (optional)"
        type="tel"
        placeholder="9876543210"
        value={form.phone}
        onChange={(e) => update("phone", e.target.value)}
        autoComplete="tel"
      />
      <Input
        label="Password"
        type="password"
        placeholder="Min 8 characters"
        value={form.password}
        onChange={(e) => update("password", e.target.value)}
        autoComplete="new-password"
        required
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <Button type="submit" loading={loading} className="w-full mt-1" size="lg">
        {loading ? "Creating account..." : "Create Account"}
      </Button>

      <p className="text-xs text-gray-400 text-center">
        By signing up, you agree to our{" "}
        <a href="/terms" className="underline">Terms</a> and{" "}
        <a href="/privacy" className="underline">Privacy Policy</a>.
      </p>
    </form>
  );
}
