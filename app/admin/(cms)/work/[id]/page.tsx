import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminHeader from '@/components/admin/AdminHeader'
import { Input, Textarea, Toggle, SubmitButton } from '@/components/admin/FormField'
import ImageUpload from '@/components/admin/ImageUpload'
import MultiImageUpload from '@/components/admin/MultiImageUpload'
import { upsertCaseStudy } from '@/lib/actions/content'

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: cs } = await supabase.from('case_studies').select('*').eq('id', id).single()
  if (!cs) notFound()

  return (
    <div>
      <AdminHeader title={`Edit: ${cs.name}`} backHref="/admin/work" />
      <div className="p-4 sm:p-6 md:p-8 max-w-2xl">
        <form action={upsertCaseStudy} className="space-y-6">
          <input type="hidden" name="id" value={cs.id} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Name" name="name" required defaultValue={cs.name} />
            <Input label="Year" name="year" type="number" defaultValue={cs.year ?? ''} />
          </div>
          <Input label="Slug" name="slug" required defaultValue={cs.slug} hint="URL: /work/slug" />
          <Input label="Tagline" name="tagline" defaultValue={cs.tagline ?? ''} />
          <Input label="Outcome" name="outcome" defaultValue={cs.outcome ?? ''} />
          <Textarea label="Challenge" name="challenge" rows={4} defaultValue={cs.challenge ?? ''} />
          <Textarea label="Solution" name="solution" rows={4} defaultValue={cs.solution ?? ''} />
          <ImageUpload label="Cover Image" name="cover_image_url" folder="work" defaultValue={cs.cover_image_url ?? ''} />
          <MultiImageUpload label="Gallery" name="gallery_urls" folder="work" defaultValue={cs.gallery_urls ?? []} hint="Project screenshots — first image renders as the hero shot. Drag to upload several at once." />
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
