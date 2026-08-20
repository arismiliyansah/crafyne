import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LoginForm from './LoginForm'

/**
 * Dulu redirect "sudah login → /admin" ditangani proxy.ts. Proxy dihapus karena
 * adapter Cloudflare belum mendukung middleware runtime Node — dan di Next 16
 * proxy SELALU runtime Node, tanpa opsi untuk mengubahnya.
 *
 * Pemeriksaannya pindah ke sini. Penjagaan rute CMS sendiri tidak bergantung
 * pada file ini: app/admin/(cms)/layout.tsx sudah memanggil getUser() dan
 * membungkus SETIAP halaman admin.
 */
export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/admin')

  return <LoginForm />
}
