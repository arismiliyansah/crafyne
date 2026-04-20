import AdminHeader from '@/components/admin/AdminHeader'
import { Input, Textarea, Toggle, SubmitButton } from '@/components/admin/FormField'
import ImageUpload from '@/components/admin/ImageUpload'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { upsertPost } from '@/lib/actions/content'

export default function NewPost() {
  return (
    <div>
      <AdminHeader title="New Post" backHref="/admin/blog" />
      <div className="p-4 sm:p-6 md:p-8 max-w-3xl">
        <form action={upsertPost} className="space-y-6">
          <Input label="Title" name="title" required placeholder="Article title" />
          <Input label="Slug" name="slug" required placeholder="article-title" hint="URL: /blog/article-title" />
          <Textarea label="Excerpt" name="excerpt" rows={2} placeholder="Short summary for preview..." />

          <div>
            <label className="block text-xs font-medium text-[#555] mb-1.5 uppercase tracking-wide">
              Content
            </label>
            <RichTextEditor name="content" placeholder="Start writing..." />
          </div>

          <ImageUpload label="Cover Image" name="cover_image_url" folder="blog" />
          <Toggle label="Published" name="published" />
          <div className="pt-2">
            <SubmitButton label="Save Post" />
          </div>
        </form>
      </div>
    </div>
  )
}
