import { createClient } from "@zalldi/auth/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomeHero from "@/components/home/HomeHero";
import VerticalSwitcher from "@/components/home/VerticalSwitcher";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <main className="flex-1">
        <HomeHero />
        <VerticalSwitcher />
      </main>
      <Footer />
    </div>
  );
}
