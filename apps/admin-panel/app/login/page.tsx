import { Metadata } from "next";
import AdminLoginForm from "@/components/auth/AdminLoginForm";

export const metadata: Metadata = { title: "Admin Login" };

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-black">Z</span>
            </div>
            <div>
              <div className="font-bold text-lg text-white leading-none">Zalldi</div>
              <div className="text-xs text-gray-400 font-medium">Admin Panel</div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="text-gray-400 text-sm mt-1">Restricted to authorized personnel only</p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
          <AdminLoginForm />
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-600">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          <span>Secured by Supabase Auth</span>
        </div>
      </div>
    </div>
  );
}
