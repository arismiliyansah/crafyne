import { createClient } from '@/lib/supabase/server'
import AdminHeader from '@/components/admin/AdminHeader'
import DeleteButton from '@/components/admin/DeleteButton'
import { Input, Textarea, Toggle, SubmitButton } from '@/components/admin/FormField'
import { upsertTestimonial, deleteTestimonial } from '@/lib/actions/content'

export default async function TestimonialsPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true })

  return (
    <div>
      <AdminHeader title="Testimonials" />
      <div className="p-8 max-w-3xl space-y-8">

        {items?.map(t => (
          <div key={t.id} className="bg-white border border-black/8 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-medium text-[#111]">{t.author_name}</p>
                <p className="text-xs text-[#888]">{t.author_role}{t.author_company && `, ${t.author_company}`}</p>
              </div>
              <div className="flex gap-4 items-center">
                {t.featured && (
                  <span className="text-[10px] bg-[#7A9E89]/15 text-[#7A9E89] px-1.5 py-0.5 rounded uppercase tracking-wide">
                    Featured
                  </span>
                )}
                <DeleteButton action={deleteTestimonial} id={t.id} />
              </div>
            </div>
            <form action={upsertTestimonial} className="space-y-4">
              <input type="hidden" name="id" value={t.id} />
              <Textarea label="Quote" name="quote" rows={3} defaultValue={t.quote} />
              <div className="grid grid-cols-3 gap-4">
                <Input label="Name" name="author_name" required defaultValue={t.author_name} />
                <Input label="Role" name="author_role" defaultValue={t.author_role ?? ''} />
                <Input label="Company" name="author_company" defaultValue={t.author_company ?? ''} />
              </div>
              <Input label="Order" name="display_order" type="number" defaultValue={t.display_order} />
              <div className="flex items-center justify-between">
                <Toggle label="Featured (shown on homepage)" name="featured" defaultChecked={t.featured} />
                <SubmitButton label="Save" />
              </div>
            </form>
          </div>
        ))}

        <details className="bg-white border border-black/8 rounded-lg overflow-hidden">
          <summary className="px-6 py-4 text-sm font-medium text-[#555] cursor-pointer hover:text-[#111] transition list-none flex items-center justify-between">
            + Add new testimonial
            <span className="text-[#ccc]">▾</span>
          </summary>
          <div className="px-6 pb-6 pt-2 border-t border-black/8">
            <form action={upsertTestimonial} className="space-y-4">
              <Textarea label="Quote" name="quote" rows={3} placeholder="Testimonial text..." />
              <div className="grid grid-cols-3 gap-4">
                <Input label="Name" name="author_name" required placeholder="Client name" />
                <Input label="Role" name="author_role" placeholder="CEO" />
                <Input label="Company" name="author_company" placeholder="Company name" />
              </div>
              <Input label="Order" name="display_order" type="number" defaultValue="0" />
              <div className="flex items-center justify-between">
                <Toggle label="Featured" name="featured" />
                <SubmitButton label="Add" />
              </div>
            </form>
          </div>
        </details>

      </div>
    </div>
  )
}
