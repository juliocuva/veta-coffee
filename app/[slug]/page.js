import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CatalogClient from './CatalogClient'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: roaster } = await supabase
    .from('roasters')
    .select('name, description')
    .eq('slug', slug)
    .single()

  if (!roaster) return { title: 'No encontrado' }

  return {
    title: `${roaster.name} · Pedido directo`,
    description: roaster.description || `Café de especialidad de ${roaster.name}`,
  }
}

export default async function SlugPage({ params }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: roaster } = await supabase
    .from('roasters')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!roaster) notFound()

  return <CatalogClient roaster={roaster} />
}
