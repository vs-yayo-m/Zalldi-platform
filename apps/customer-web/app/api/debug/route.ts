import { createServiceRoleClient } from '@/services/supabase/client.server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createServiceRoleClient()
    
    const { data: cats, error: catError } = await supabase
      .from('categories')
      .select('id, name')
      .limit(5)
    
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('id, name, darkstore_id')
      .limit(5)
    
    const { data: darkstores, error: dsError } = await supabase
      .from('darkstores')
      .select('id, name, is_open')
      .limit(3)
    
    return NextResponse.json({
      supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      service_key_exists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      service_key_length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length,
      categories: { data: cats, error: catError?.message },
      products: { data: products, error: prodError?.message },
      darkstores: { data: darkstores, error: dsError?.message },
    })
  } catch (err) {
    return NextResponse.json({
      fatal_error: err instanceof Error ? err.message : String(err)
    }, { status: 500 })
  }
}