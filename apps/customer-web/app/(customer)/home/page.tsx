import HomeView from '@/features/home/HomeView'

export const metadata = {
  title: 'Zalldi — Fast Delivery',
  description: 'Groceries and food delivered in minutes',
}

export const revalidate = 0

interface Props {
  searchParams: Promise < { ds ? : string } >
}

export default function HomePage({ searchParams }: Props) {
  return <HomeView searchParams={searchParams} />
}