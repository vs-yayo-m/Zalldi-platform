// apps/customer-web/features/home/HomeView.tsx
import { Suspense } from 'react'
import { getDarkstoreHomeData } from '@/services/darkstore.service'
import { HomeHeader } from './components/HomeHeader'

const EMPTY_DATA = {
  categories: [],
  darkstoreOpen: false,
  opensAt: '06:00',
  deliveryMins: 20,
}

interface Props {
  searchParams: Promise < { ds ? : string } >
}

async function HomeContent({ searchParams }: Props) {
  const { ds: darkstoreId } = await searchParams
  
  if (!darkstoreId) {
    return <HomeHeader groceryData={EMPTY_DATA} hasLocation={false} />
  }
  
  const groceryData = await getDarkstoreHomeData(darkstoreId)
  
  return <HomeHeader groceryData={groceryData} hasLocation={true} />
}

function HomeSkeleton() {
  return (
    <div style={{ background: '#0c1117', minHeight: '100vh' }}>
      <div style={{ padding: '10px 16px 8px', background: '#0c1117' }}>
        <div style={{ height: 30, background: 'rgba(255,255,255,0.08)', borderRadius: 8, marginBottom: 8 }} />
        <div style={{ height: 16, width: '60%', background: 'rgba(255,255,255,0.05)', borderRadius: 8 }} />
      </div>
      <div style={{ padding: '8px 14px', background: '#2d1500' }}>
        <div style={{ height: 40, background: 'rgba(255,255,255,0.08)', borderRadius: 14 }} />
      </div>
    </div>
  )
}

export default async function HomeView({ searchParams }: Props) {
  return (
    <div className="min-h-screen" style={{ background: '#f9fafb' }}>
      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}