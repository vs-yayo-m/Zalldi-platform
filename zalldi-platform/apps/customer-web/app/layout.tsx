import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Zalldi — Food, Groceries & More",
    template: "%s | Zalldi",
  },
  description: "Order food, groceries and more — delivered fast to your door.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_CUSTOMER_WEB_URL ?? "https://zalldi.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
