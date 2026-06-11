import { createClient } from '@/lib/supabase/server'
import AdminHeader from '@/components/admin/AdminHeader'
import DeleteButton from '@/components/admin/DeleteButton'
import { Input, SubmitButton } from '@/components/admin/FormField'
import { upsertStat, deleteStat } from '@/lib/actions/content'

export default async function StatsPage() {
  const supabase = await createClient()
  const { data: items } = await supabase.from('stats').select('*').order('display_order', { ascending: true })

  return (
    <div>
      <AdminHeader title="Stats" />
      <div className="p-4 sm:p-6 md:p-8 max-w-3xl space-y-8">

        {items?.map(s => (
          <div key={s.id} className="bg-white border border-black/8 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <p className="font-medium text-[#111]">{s.value}{s.suffix} — {s.label}</p>
              <DeleteButton action={deleteStat} id={s.id} />
            </div>
            <form action={upsertStat} className="space-y-4">
              <input type="hidden" name="id" value={s.id} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Value" name="value" type="number" step="any" required defaultValue={s.value} />
                <Input label="Label" name="label" required defaultValue={s.label} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input label="Suffix" name="suffix" defaultValue={s.suffix} hint="e.g. % or /5" />
                <Input label="Decimals" name="decimals" type="number" defaultValue={s.decimals} />
                <Input label="Order" name="display_order" type="number" defaultValue={s.display_order} />
              </div>
              <div className="flex justify-end"><SubmitButton label="Save" /></div>
            </form>
          </div>
        ))}

        <details className="bg-white border border-black/8 rounded-lg overflow-hidden">
          <summary className="px-6 py-4 text-sm font-medium text-[#555] cursor-pointer hover:text-[#111] transition list-none flex items-center justify-between">
            + Add new stat
            <span className="text-[#ccc]">▾</span>
          </summary>
          <div className="px-6 pb-6 pt-2 border-t border-black/8">
            <form action={upsertStat} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Value" name="value" type="number" step="any" required placeholder="142" />
                <Input label="Label" name="label" required placeholder="Products shipped" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input label="Suffix" name="suffix" placeholder="% or /5" />
                <Input label="Decimals" name="decimals" type="number" defaultValue="0" />
                <Input label="Order" name="display_order" type="number" defaultValue="0" />
              </div>
              <div className="flex justify-end"><SubmitButton label="Add stat" /></div>
            </form>
          </div>
        </details>

      </div>
    </div>
  )
}
