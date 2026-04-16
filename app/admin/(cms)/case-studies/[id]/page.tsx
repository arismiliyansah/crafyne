import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminHeader from '@/components/admin/AdminHeader'
import { Input, Textarea, Toggle, SubmitButton } from '@/components/admin/FormField'
import { upsertCaseStudy } from '@/lib/actions/content'

export default async function EditCaseStudy({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: cs } = await supabase.from('case_studies').select('*').eq('id', id).single()
  if (!cs) notFound()

  return (
    <div>
      <AdminHeader title={`Edit: ${cs.client}`} backHref="/admin/case-studies" />
      <div className="p-8 max-w-2xl">
        <form action={upsertCaseStudy} className="space-y-6">
          <input type="hidden" name="id" value={cs.id} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Client" name="client" required defaultValue={cs.client} />
            <Input label="Year" name="year" type="number" defaultValue={cs.year ?? ''} />
          </div>
          <Input label="Slug" name="slug" required defaultValue={cs.slug} hint="URL: /case-studies/slug" />
          <Input label="Tagline" name="tagline" defaultValue={cs.tagline ?? ''} />
          <Input label="Outcome" name="outcome" defaultValue={cs.outcome ?? ''} />
          <Textarea label="Challenge" name="challenge" rows={4} defaultValue={cs.challenge ?? ''} />
          <Textarea label="Solution" name="solution" rows={4} defaultValue={cs.solution ?? ''} />
          <Input label="Cover Image URL" name="cover_image_url" type="url" defaultValue={cs.cover_image_url ?? ''} />
          <Input label="Live project URL" name="project_url" type="url" defaultValue={cs.project_url ?? ''} hint="Optional — link to the live site or product" />
          <Input label="Tags" name="tags" defaultValue={cs.tags?.join(', ') ?? ''} hint="Separate with commas" />
          <Input label="Display order" name="display_order" type="number" defaultValue={cs.display_order} />
          <div className="flex gap-6">
            <Toggle label="Featured" name="featured" defaultChecked={cs.featured} />
            <Toggle label="Published" name="published" defaultChecked={cs.published} />
          </div>
          <div className="pt-2">
            <SubmitButton label="Save Changes" />
          </div>
        </form>
      </div>
    </div>
  )
}
