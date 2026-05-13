import { Metadata } from "next";
import SellerLoginForm from "@/components/auth/SellerLoginForm";

export const metadata: Metadata = { title: "Seller Login" };

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-black">Z</span>
            </div>
            <div>
              <div className="font-bold text-lg text-gray-900 leading-none">Zalldi</div>
              <div className="text-xs text-gray-500 font-medium">Seller Hub</div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Login</h1>
          <p className="text-gray-500 text-sm mt-1">Access your seller dashboard</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <SellerLoginForm />
        </div>
      </div>
    </div>
  );
}
