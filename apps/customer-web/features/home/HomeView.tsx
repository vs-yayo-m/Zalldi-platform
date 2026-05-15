import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getDarkstoreIdFromCookie } from '@/app/actions/location.action'
import { getDarkstoreHomeData } from '@/services/darkstore.service'
import { HomeHeader } from './components/HomeHeader'
import { LocationGate } from './components/LocationGate'

// Empty grocery data for when location not set yet
const EMPTY_DATA = {
  categories: [],
  darkstoreOpen: false,
  opensAt: '06:00',
  deliveryMins: 20,
}

async function HomeContent() {
  const darkstoreId = await getDarkstoreIdFromCookie()
  
  if (!darkstoreId) {
    // No location yet — show header with location gate
    return (
      <>
        <HomeHeader groceryData={EMPTY_DATA} hasLocation={false} />
      </>
    )
  }
  
  const groceryData = await getDarkstoreHomeData(darkstoreId)
  
  return (
    <HomeHeader groceryData={groceryData} hasLocation={true} />
  )
}

function HomeSkeleton() {
  return (
    <div style={{ background: '#0c1117', minHeight: '100vh' }}>
      {/* Header skeleton */}
      <div style={{ padding: '10px 16px 8px', background: '#0c1117' }}>
        <div style={{ height: 30, background: 'rgba(255,255,255,0.08)', borderRadius: 8, marginBottom: 8 }} />
        <div style={{ height: 16, width: '60%', background: 'rgba(255,255,255,0.05)', borderRadius: 8 }} />
      </div>
      {/* Search skeleton */}
      <div style={{ padding: '8px 14px', background: '#2d1500' }}>
        <div style={{ height: 40, background: 'rgba(255,255,255,0.08)', borderRadius: 14 }} />
      </div>
      {/* Tab skeleton */}
      <div style={{ display: 'flex', background: '#2d1500', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
            <div style={{ width: 40, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function HomeView() {
  return (
    <div className="min-h-screen" style={{ background: '#f9fafb' }}>
      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent />
      </Suspense>
    </div>
  )
}