import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

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
    </div>
  )
}
