import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminHeader from '@/components/admin/AdminHeader'
import { Input, Textarea, Toggle, SubmitButton } from '@/components/admin/FormField'
import ImageUpload from '@/components/admin/ImageUpload'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { upsertPost } from '@/lib/actions/content'

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: post } = await supabase.from('posts').select('*').eq('id', id).single()
  if (!post) notFound()

  return (
    <div>
      <AdminHeader title={`Edit: ${post.title}`} backHref="/admin/blog" />
      <div className="p-4 sm:p-6 md:p-8 max-w-3xl">
        <form action={upsertPost} className="space-y-6">
          <input type="hidden" name="id" value={post.id} />
          <Input label="Title" name="title" required defaultValue={post.title} />
          <Input label="Slug" name="slug" required defaultValue={post.slug} hint="URL: /blog/slug" />
          <Textarea label="Excerpt" name="excerpt" rows={2} defaultValue={post.excerpt ?? ''} />

          <div>
            <label className="block text-xs font-medium text-[#555] mb-1.5 uppercase tracking-wide">
              Content
            </label>
            <RichTextEditor name="content" defaultValue={post.content ?? ''} />
          </div>

          <ImageUpload label="Cover Image" name="cover_image_url" folder="blog" defaultValue={post.cover_image_url ?? ''} />
          <Toggle label="Published" name="published" defaultChecked={post.published} />
          <div className="pt-2">
            <SubmitButton label="Save Changes" />
          </div>
        </form>
      </div>
    </div>
  )
}
