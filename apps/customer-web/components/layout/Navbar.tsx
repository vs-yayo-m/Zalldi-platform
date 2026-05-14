'use client'
import Link from 'next/link'
import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import CartButton from '@/components/layout/CartButton'

interface NavbarProps {
  user ? : User | null
}

// Simple avatar fallback — no @zalldi/ui dependency
function AvatarFallback({ name }: { name ? : string | null }) {
  const letter = name?.charAt(0).toUpperCase() ?? 'U'
  return (
    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">
      {letter}
    </div>
  )
}

export default function Navbar({ user }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="container-app">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">Z</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Zalldi</span>
          </Link>

          {/* Location */}
          <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            <span className="text-orange-500">📍</span>
            <span className="text-gray-600 font-medium">Select Location</span>
            <span className="text-gray-400">▾</span>
          </button>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/groceries" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-colors">
              🛒 Groceries
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <CartButton />

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <AvatarFallback name={user.email} />
                  <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-24 truncate">
                    {user.email}
                  </span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-50">
                    <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>My Account</Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>My Orders</Link>
                    <Link href="/account/addresses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Addresses</Link>
                    <hr className="my-1 border-gray-100" />
                    <Link href="/login" className="block px-4 py-2 text-sm text-red-500 hover:bg-red-50" onClick={() => setMenuOpen(false)}>Sign Out</Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">
                  Login
                </Link>
                <Link href="/login" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="block w-5 h-0.5 bg-gray-600 mb-1" />
              <span className="block w-5 h-0.5 bg-gray-600 mb-1" />
              <span className="block w-5 h-0.5 bg-gray-600" />
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 pb-4 flex flex-col gap-1">
            <Link href="/groceries" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>🛒 Groceries</Link>
          </div>
        )}
      </div>
    </header>
  )
}