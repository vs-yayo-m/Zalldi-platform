import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container-app py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">Z</span>
              </div>
              <span className="font-bold text-xl text-white">Zalldi</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Food, groceries and more — delivered fast to your door.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white text-sm mb-3">Explore</h3>
            <ul className="flex flex-col gap-2">
              <li><Link href="/food" className="text-sm hover:text-orange-400 transition-colors">Food Delivery</Link></li>
              <li><Link href="/groceries" className="text-sm hover:text-orange-400 transition-colors">Groceries</Link></li>
              <li><Link href="/dineout" className="text-sm hover:text-orange-400 transition-colors">Dine Out</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white text-sm mb-3">Company</h3>
            <ul className="flex flex-col gap-2">
              <li><Link href="/about" className="text-sm hover:text-orange-400 transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="text-sm hover:text-orange-400 transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="text-sm hover:text-orange-400 transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white text-sm mb-3">Legal</h3>
            <ul className="flex flex-col gap-2">
              <li><Link href="/privacy" className="text-sm hover:text-orange-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm hover:text-orange-400 transition-colors">Terms of Use</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-orange-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} Zalldi. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-gray-500 hover:text-orange-400 transition-colors text-sm">Partner with us</Link>
            <Link href="/seller" className="text-gray-500 hover:text-orange-400 transition-colors text-sm">Sell on Zalldi</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
