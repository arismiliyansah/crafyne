import { createClient } from '@/lib/supabase/server'
import AdminHeader from '@/components/admin/AdminHeader'
import DeleteButton from '@/components/admin/DeleteButton'
import { Input, Textarea, SubmitButton } from '@/components/admin/FormField'
import { upsertTechGroup, deleteTechGroup } from '@/lib/actions/content'

export default async function TechStackPage() {
  const supabase = await createClient()
  const { data: items } = await supabase.from('tech_groups').select('*').order('display_order', { ascending: true })

  return (
    <div>
      <AdminHeader title="Tech Stack" />
      <div className="p-4 sm:p-6 md:p-8 max-w-3xl space-y-8">

        {items?.map(g => (
          <div key={g.id} className="bg-white border border-black/8 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <p className="font-medium text-[#111]">{g.label}</p>
              <DeleteButton action={deleteTechGroup} id={g.id} />
            </div>
            <form action={upsertTechGroup} className="space-y-4">
              <input type="hidden" name="id" value={g.id} />
              <Input label="Label" name="label" required defaultValue={g.label} />
              <Textarea label="Items" name="items" rows={2} hint="Comma-separated" defaultValue={(g.items ?? []).join(', ')} />
              <div className="flex items-center justify-between">
                <Input label="Order" name="display_order" type="number" defaultValue={g.display_order} />
                <SubmitButton label="Save" />
              </div>
            </form>
          </div>
        ))}

        <details className="bg-white border border-black/8 rounded-lg overflow-hidden">
          <summary className="px-6 py-4 text-sm font-medium text-[#555] cursor-pointer hover:text-[#111] transition list-none flex items-center justify-between">
            + Add new group
            <span className="text-[#ccc]">▾</span>
          </summary>
          <div className="px-6 pb-6 pt-2 border-t border-black/8">
            <form action={upsertTechGroup} className="space-y-4">
              <Input label="Label" name="label" required placeholder="Frontend" />
              <Textarea label="Items" name="items" rows={2} hint="Comma-separated" placeholder="React, Next.js, TypeScript" />
              <div className="flex items-center justify-between">
                <Input label="Order" name="display_order" type="number" defaultValue="0" />
                <SubmitButton label="Add group" />
              </div>
            </form>
          </div>
        </details>

      </div>
    </div>
  )
}
