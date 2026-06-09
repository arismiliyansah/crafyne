import { createClient } from '@/lib/supabase/server'
import AdminHeader from '@/components/admin/AdminHeader'
import DeleteButton from '@/components/admin/DeleteButton'
import { Input, Textarea, SubmitButton } from '@/components/admin/FormField'
import { upsertFaq, deleteFaq } from '@/lib/actions/content'

export default async function FaqPage() {
  const supabase = await createClient()
  const { data: items } = await supabase.from('faqs').select('*').order('display_order', { ascending: true })

  return (
    <div>
      <AdminHeader title="FAQ" />
      <div className="p-4 sm:p-6 md:p-8 max-w-3xl space-y-8">

        {items?.map(f => (
          <div key={f.id} className="bg-white border border-black/8 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <p className="font-medium text-[#111] pr-4">{f.question}</p>
              <DeleteButton action={deleteFaq} id={f.id} />
            </div>
            <form action={upsertFaq} className="space-y-4">
              <input type="hidden" name="id" value={f.id} />
              <Input label="Question" name="question" required defaultValue={f.question} />
              <Textarea label="Answer" name="answer" rows={3} defaultValue={f.answer} />
              <div className="flex items-center justify-between">
                <Input label="Order" name="display_order" type="number" defaultValue={f.display_order} />
                <SubmitButton label="Save" />
              </div>
            </form>
          </div>
        ))}

        <details className="bg-white border border-black/8 rounded-lg overflow-hidden">
          <summary className="px-6 py-4 text-sm font-medium text-[#555] cursor-pointer hover:text-[#111] transition list-none flex items-center justify-between">
            + Add new question
            <span className="text-[#ccc]">▾</span>
          </summary>
          <div className="px-6 pb-6 pt-2 border-t border-black/8">
            <form action={upsertFaq} className="space-y-4">
              <Input label="Question" name="question" required placeholder="How small is too small?" />
              <Textarea label="Answer" name="answer" rows={3} placeholder="Answer..." />
              <div className="flex items-center justify-between">
                <Input label="Order" name="display_order" type="number" defaultValue="0" />
                <SubmitButton label="Add question" />
              </div>
            </form>
          </div>
        </details>

      </div>
    </div>
  )
}
