import { Suspense } from 'react'
import { getDarkstoreIdFromCookie } from '@/app/actions/location.action'
import { getDarkstoreHomeData } from '@/services/darkstore.service'
import { LocationBar } from './components/LocationBar'
import { HomeSearchBar } from './components/HomeSearchBar'
import { VerticalTabSwitcher } from './components/VerticalTabSwitcher'
import { LocationGate } from './components/LocationGate'

// Skeleton shown while data loads
function GrocerySkeleton() {
  return (
    <div className="pt-4 px-4 space-y-6">
      {[1, 2, 3].map(i => (
        <div key={i}>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="flex gap-3 overflow-hidden">
            {[1, 2, 3].map(j => (
              <div key={j} className="w-36 flex-shrink-0">
                <div className="h-32 bg-gray-200 rounded-2xl animate-pulse mb-2" />
                <div className="h-3 bg-gray-200 rounded animate-pulse mb-1" />
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

async function HomeContent() {
  const darkstoreId = await getDarkstoreIdFromCookie()
  
  // No darkstore in cookie = location not set yet
  if (!darkstoreId) {
    return (
      <LocationGate>
        {/* Children shown after location granted */}
        <HomeWithData />
      </LocationGate>
    )
  }
  
  const groceryData = await getDarkstoreHomeData(darkstoreId)
  
  return (
    <>
      <LocationBar />
      <HomeSearchBar />
      <VerticalTabSwitcher groceryData={groceryData} />
    </>
  )
}

async function HomeWithData() {
  // Called after location is granted and cookie is set
  // Re-render via router.refresh() from LocationGate
  const darkstoreId = await getDarkstoreIdFromCookie()
  
  if (!darkstoreId) return null
  
  const groceryData = await getDarkstoreHomeData(darkstoreId)
  
  return (
    <>
      <LocationBar />
      <HomeSearchBar />
      <VerticalTabSwitcher groceryData={groceryData} />
    </>
  )
}

export default async function HomeView() {
  return (
    <div className="min-h-screen bg-neutral-900">
      <Suspense fallback={<GrocerySkeleton />}>
        <HomeContent />
      </Suspense>
    </div>
  )
}