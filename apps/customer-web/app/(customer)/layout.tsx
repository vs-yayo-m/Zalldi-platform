import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/features/cart/CartDrawer";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar user={null} />
      <main className="min-h-screen bg-gray-50">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}