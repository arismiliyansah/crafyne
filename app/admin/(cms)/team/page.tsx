import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AdminHeader from '@/components/admin/AdminHeader'
import DeleteButton from '@/components/admin/DeleteButton'
import { Input, Textarea, Toggle, SubmitButton } from '@/components/admin/FormField'
import ImageUpload from '@/components/admin/ImageUpload'
import { upsertTeamMember, deleteTeamMember } from '@/lib/actions/content'

export default async function TeamPage() {
  const supabase = await createClient()
  const { data: members } = await supabase
    .from('team_members')
    .select('*')
    .order('display_order', { ascending: true })

  return (
    <div>
      <AdminHeader title="Team" />
      <div className="p-4 sm:p-6 md:p-8 max-w-3xl space-y-10">

        {/* List */}
        {members?.map(m => (
          <div key={m.id} className="bg-white border border-black/8 rounded-lg p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="font-medium text-[#111]">{m.name}</p>
                <p className="text-sm text-[#888] font-light">{m.role}</p>
              </div>
              <div className="flex gap-4">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  m.active ? 'bg-green-50 text-green-700' : 'bg-black/5 text-[#888]'
                }`}>
                  {m.active ? 'Active' : 'Inactive'}
                </span>
                <DeleteButton action={deleteTeamMember} id={m.id} />
              </div>
            </div>
            <form action={upsertTeamMember} className="grid grid-cols-2 gap-4">
              <input type="hidden" name="id" value={m.id} />
              <div className="col-span-2 max-w-[200px]">
                <ImageUpload label="Photo" name="photo_url" folder="team" defaultValue={m.photo_url ?? ''} aspect="aspect-[3/4]" />
              </div>
              <Input label="Name" name="name" required defaultValue={m.name} />
              <Input label="Role" name="role" required defaultValue={m.role} />
              <Input label="LinkedIn URL" name="linkedin_url" defaultValue={m.linkedin_url ?? ''} />
              <Input label="GitHub URL" name="github_url" defaultValue={m.github_url ?? ''} />
              <Input label="Order" name="display_order" type="number" defaultValue={m.display_order} />
              <div className="col-span-2">
                <Textarea label="Bio" name="bio" rows={2} defaultValue={m.bio ?? ''} />
              </div>
              <div className="col-span-2 flex items-center justify-between">
                <Toggle label="Active" name="active" defaultChecked={m.active} />
                <SubmitButton label="Save" />
              </div>
            </form>
          </div>
        ))}

        {/* Add new */}
        <details className="bg-white border border-black/8 rounded-lg overflow-hidden">
          <summary className="px-6 py-4 text-sm font-medium text-[#555] cursor-pointer hover:text-[#111] transition list-none flex items-center justify-between">
            + Add new member
            <span className="text-[#ccc]">▾</span>
          </summary>
          <div className="px-6 pb-6 pt-2 border-t border-black/8">
            <form action={upsertTeamMember} className="grid grid-cols-2 gap-4">
              <div className="col-span-2 max-w-[200px]">
                <ImageUpload label="Photo" name="photo_url" folder="team" aspect="aspect-[3/4]" />
              </div>
              <Input label="Name" name="name" required placeholder="Full name" />
              <Input label="Role" name="role" required placeholder="Jabatan" />
              <Input label="LinkedIn URL" name="linkedin_url" placeholder="https://linkedin.com/in/..." />
              <Input label="GitHub URL" name="github_url" placeholder="https://github.com/..." />
              <Input label="Order" name="display_order" type="number" defaultValue="0" />
              <div className="col-span-2">
                <Textarea label="Bio" name="bio" rows={2} placeholder="Short bio..." />
              </div>
              <div className="col-span-2 flex items-center justify-between">
                <Toggle label="Active" name="active" defaultChecked />
                <SubmitButton label="Add member" />
              </div>
            </form>
          </div>
        </details>

      </div>
    </div>
  )
}
