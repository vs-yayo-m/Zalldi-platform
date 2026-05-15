'use client'
import { useState } from 'react'
import { EtaAddressBar } from './EtaAddressBar'
import { HeroSearchBar } from './HeroSearchBar'
import { VerticalTabSwitcher } from './VerticalTabSwitcher'
import { HeroWelcome } from './HeroWelcome'
import { LocationGate } from './LocationGate'
import type { DarkstoreHomeData } from '@/services/darkstore.service'

interface Props {
  groceryData: DarkstoreHomeData
  hasLocation: boolean
}

export function HomeHeader({ groceryData, hasLocation }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  
  return (
    <>
      {/* ZONE 1 — ETA + Address bar (scrolls away) */}
      <div style={{
        background: 'linear-gradient(180deg, #0c1117 0%, #1a1206 70%, #2d1500 100%)',
      }}>
        <EtaAddressBar onMenuOpen={() => setMenuOpen(true)} />
      </div>

      {/* ZONE 2 — Search + Tab switcher (sticky) */}
      <div style={{
        background: '#2d1500',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 24px rgba(0,0,0,0.40)',
      }}>
        <HeroSearchBar />
        <VerticalTabSwitcher groceryData={groceryData} />
      </div>

      {/* ZONE 3 — Hero welcome (scrolls with page) */}
      {!hasLocation ? (
        <LocationGate>
          <HeroWelcome />
        </LocationGate>
      ) : (
        <HeroWelcome />
      )}

      {/* Mobile menu — Section 10 */}
      {/* <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} /> */}
    </>
  )
}