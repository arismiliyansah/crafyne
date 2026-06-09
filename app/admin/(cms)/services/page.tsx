import { createClient } from '@/lib/supabase/server'
import AdminHeader from '@/components/admin/AdminHeader'
import DeleteButton from '@/components/admin/DeleteButton'
import { Input, Textarea, Toggle, SubmitButton } from '@/components/admin/FormField'
import { upsertService, deleteService } from '@/lib/actions/content'

export default async function ServicesPage() {
  const supabase = await createClient()
  const { data: items } = await supabase.from('services').select('*').order('display_order', { ascending: true })

  return (
    <div>
      <AdminHeader title="Services" />
      <div className="p-4 sm:p-6 md:p-8 max-w-3xl space-y-8">

        {items?.map(s => (
          <div key={s.id} className="bg-white border border-black/8 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-medium text-[#111]">{s.title}</p>
                <p className="text-xs text-[#888]">{s.tone} · {s.span}</p>
              </div>
              <DeleteButton action={deleteService} id={s.id} />
            </div>
            <form action={upsertService} className="space-y-4">
              <input type="hidden" name="id" value={s.id} />
              <Input label="Title" name="title" required defaultValue={s.title} />
              <Textarea label="Body" name="body" rows={2} defaultValue={s.body} />
              <Textarea label="Bullets" name="bullets" rows={3} hint="One per line" defaultValue={(s.bullets ?? []).join('\n')} />
              <div className="grid grid-cols-3 gap-4">
                <Input label="Tone" name="tone" defaultValue={s.tone} hint="peach·navy·orange·crimson·cream" />
                <Input label="Glyph" name="glyph" defaultValue={s.glyph ?? ''} />
                <Input label="Span" name="span" defaultValue={s.span} hint="trio·wide" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Input label="Order" name="display_order" type="number" defaultValue={s.display_order} />
                  <Toggle label="Active" name="active" defaultChecked={s.active} />
                </div>
                <SubmitButton label="Save" />
              </div>
            </form>
          </div>
        ))}

        <details className="bg-white border border-black/8 rounded-lg overflow-hidden">
          <summary className="px-6 py-4 text-sm font-medium text-[#555] cursor-pointer hover:text-[#111] transition list-none flex items-center justify-between">
            + Add new service
            <span className="text-[#ccc]">▾</span>
          </summary>
          <div className="px-6 pb-6 pt-2 border-t border-black/8">
            <form action={upsertService} className="space-y-4">
              <Input label="Title" name="title" required placeholder="Web Engineering" />
              <Textarea label="Body" name="body" rows={2} placeholder="Short description..." />
              <Textarea label="Bullets" name="bullets" rows={3} hint="One per line" placeholder={'Next.js · TypeScript\nHeadless CMS\nReal performance budgets'} />
              <div className="grid grid-cols-3 gap-4">
                <Input label="Tone" name="tone" defaultValue="cream" hint="peach·navy·orange·crimson·cream" />
                <Input label="Glyph" name="glyph" placeholder="▤" />
                <Input label="Span" name="span" defaultValue="trio" hint="trio·wide" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Input label="Order" name="display_order" type="number" defaultValue="0" />
                  <Toggle label="Active" name="active" defaultChecked />
                </div>
                <SubmitButton label="Add service" />
              </div>
            </form>
          </div>
        </details>

      </div>
    </div>
  )
}
