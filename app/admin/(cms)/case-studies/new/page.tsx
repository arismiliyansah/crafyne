import AdminHeader from '@/components/admin/AdminHeader'
import { Input, Textarea, Toggle, SubmitButton } from '@/components/admin/FormField'
import ImageUpload from '@/components/admin/ImageUpload'
import MultiImageUpload from '@/components/admin/MultiImageUpload'
import { upsertCaseStudy } from '@/lib/actions/content'

export default function NewCaseStudy() {
  return (
    <div>
      <AdminHeader title="New Case Study" backHref="/admin/case-studies" />
      <div className="p-4 sm:p-6 md:p-8 max-w-2xl">
        <form action={upsertCaseStudy} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Name" name="name" required placeholder="Project name" />
            <Input label="Year" name="year" type="number" placeholder="2024" />
          </div>
          <Input label="Slug" name="slug" required placeholder="project-name" hint="URL: /case-studies/project-name" />
          <Input label="Tagline" name="tagline" placeholder="Platform rebuild, 2024" />
          <Input label="Outcome" name="outcome" placeholder="Load times down 80%" />
          <Textarea label="Challenge" name="challenge" rows={4} placeholder="What problem did the project face..." />
          <Textarea label="Solution" name="solution" rows={4} placeholder="How we solved it..." />
          <ImageUpload label="Cover Image" name="cover_image_url" folder="case-studies" />
          <MultiImageUpload label="Gallery" name="gallery_urls" folder="case-studies" hint="Project screenshots — first image renders as the hero shot. Drag to upload several at once." />
          <Input label="Live project URL" name="project_url" type="url" placeholder="https://..." hint="Optional — link to the live site or product" />
          <Input label="Tags" name="tags" placeholder="react, nextjs, design-system" hint="Separate with commas" />
          <Input label="Display order" name="display_order" type="number" defaultValue="0" />
          <div className="flex gap-6">
            <Toggle label="Featured" name="featured" />
            <Toggle label="Published" name="published" />
          </div>
          <div className="pt-2">
            <SubmitButton label="Save Case Study" />
          </div>
        </form>
      </div>
    </div>
  )
}
