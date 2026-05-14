import { HomeView } from '@/features/home'

export const metadata = {
  title: 'Zalldi — Fast Delivery',
  description: 'Groceries and food delivered in minutes',
}

// Revalidate every 5 minutes — products/stock changes
export const revalidate = 300

export default function HomePage() {
  return <HomeView />
}