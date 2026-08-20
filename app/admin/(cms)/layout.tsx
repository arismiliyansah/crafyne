import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import SaveToast from '@/components/admin/SaveToast'
import SessionKeeper from '@/components/admin/SessionKeeper'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-[#F9F9F7]">
      <AdminSidebar email={user.email ?? ''} />
      <main className="md:ml-56 min-w-0">
        {children}
      </main>
      {/* Satu toast untuk semua halaman CMS — dipasang di layout, bukan di
          tiap halaman, supaya 13 form Save tidak perlu diubah satu-satu. */}
      <Suspense fallback={null}>
        <SaveToast />
      </Suspense>
      <SessionKeeper />
    </div>
  )
}
