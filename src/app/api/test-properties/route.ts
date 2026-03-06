import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  const { data, error, count } = await supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('status', 'active')
  
  return NextResponse.json({
    success: !error,
    count,
    dataLength: data?.length || 0,
    error: error?.message,
    sample: data?.[0] || null
  })
}
