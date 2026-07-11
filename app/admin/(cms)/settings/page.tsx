import { createClient } from '@/lib/supabase/server'
import AdminHeader from '@/components/admin/AdminHeader'
import { Input, Textarea, SubmitButton } from '@/components/admin/FormField'
import { saveSettings } from '@/lib/actions/content'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: rows } = await supabase.from('site_settings').select('key, value')
  const s: Record<string, string> = Object.fromEntries((rows ?? []).map(r => [r.key, r.value ?? '']))

  return (
    <div>
      <AdminHeader title="Settings" />
      <div className="p-4 sm:p-6 md:p-8 max-w-2xl">
        <form action={saveSettings} className="space-y-10">

          <section>
            <h2 className="text-xs font-medium text-[#888] uppercase tracking-widest mb-5">Hero</h2>
            <div className="space-y-5">
              <Input label="Eyebrow" name="hero_eyebrow" defaultValue={s.hero_eyebrow} placeholder="Software Studio — Est. 2020" />
              <Textarea label="Headline" name="hero_headline" rows={2} defaultValue={s.hero_headline} placeholder="We build software for people who care how it feels." />
              <Input label="Sub-headline" name="hero_subheadline" defaultValue={s.hero_subheadline} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Primary CTA" name="hero_cta_primary" defaultValue={s.hero_cta_primary} />
                <Input label="Secondary CTA" name="hero_cta_secondary" defaultValue={s.hero_cta_secondary} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-medium text-[#888] uppercase tracking-widest mb-5">Proof Strip</h2>
            <Input
              label="Client names (comma-separated)"
              name="proof_clients"
              defaultValue={s.proof_clients}
              hint="Example: Meridian,Holm Systems,Verdant"
            />
          </section>

          <section>
            <h2 className="text-xs font-medium text-[#888] uppercase tracking-widest mb-5">Contact & Agency</h2>
            <div className="space-y-4">
              <Input label="Email" name="agency_email" type="email" defaultValue={s.agency_email} />
              <Input label="Location" name="agency_location" defaultValue={s.agency_location} />
              <Textarea label="Footer tagline" name="agency_tagline" rows={2} defaultValue={s.agency_tagline} />
              <Input label="Contact invite text" name="contact_invite" defaultValue={s.contact_invite} />
              <Input label="Availability label" name="contact_availability_label" defaultValue={s.contact_availability_label} placeholder="Booking now" />
              <Input label="Availability text" name="contact_availability_text" defaultValue={s.contact_availability_text} placeholder="Now booking · Q3 2026" hint="Shown on the contact page availability chip. Leave empty for the default." />
            </div>
          </section>

          <section>
            <h2 className="text-xs font-medium text-[#888] uppercase tracking-widest mb-5">Services</h2>
            <Textarea
              label="Services (JSON)"
              name="services"
              rows={12}
              defaultValue={s.services}
              hint='Format: [{"order":1,"name":"...","description":"..."}]'
            />
          </section>

          <section>
            <h2 className="text-xs font-medium text-[#888] uppercase tracking-widest mb-5">Pricing — Care &amp; hosting</h2>
            <div className="space-y-4">
              <Input label="Title" name="pricing_care_title" defaultValue={s.pricing_care_title} placeholder="Care & hosting" hint="Leave empty to hide the add-on strip entirely." />
              <Textarea label="Blurb" name="pricing_care_blurb" rows={2} defaultValue={s.pricing_care_blurb} placeholder="Optional. Keep your product secure, monitored, and online after launch." />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Price" name="pricing_care_price" defaultValue={s.pricing_care_price} placeholder="from 200" hint='Prefix with "from" for a starting price. No $ sign.' />
                <Input label="Unit" name="pricing_care_unit" defaultValue={s.pricing_care_unit} placeholder="/mo" />
              </div>
              <Input label="Features (comma-separated)" name="pricing_care_features" defaultValue={s.pricing_care_features} hint="Example: Security updates,Uptime monitoring & backups,Hosting / server,Small changes each month" />
            </div>
          </section>

          <section>
            <h2 className="text-xs font-medium text-[#888] uppercase tracking-widest mb-5">Team Section</h2>
            <div className="space-y-4">
              <Input label="Eyebrow" name="team_eyebrow" defaultValue={s.team_eyebrow} placeholder="the studio" />
              <Textarea label="Title" name="team_title" rows={2} defaultValue={s.team_title} hint="Leave empty for the auto default (uses the live team count, e.g. “Six people…”)" />
              <Textarea label="Sub-text" name="team_sub" rows={2} defaultValue={s.team_sub} placeholder="We keep the studio small on purpose…" />
            </div>
          </section>

          <section>
            <h2 className="text-xs font-medium text-[#888] uppercase tracking-widest mb-5">Footer — Social Media</h2>
            <div className="space-y-4">
              <Input label="Instagram URL" name="footer_instagram_url" defaultValue={s.footer_instagram_url} placeholder="https://instagram.com/crafyne" />
              <Input label="Facebook URL"  name="footer_facebook_url"  defaultValue={s.footer_facebook_url}  placeholder="https://facebook.com/crafyne" />
              <Input label="Threads URL"   name="footer_threads_url"   defaultValue={s.footer_threads_url}   placeholder="https://threads.net/@crafyne" />
              <Input label="GitHub URL"    name="footer_github_url"    defaultValue={s.footer_github_url}    placeholder="https://github.com/crafyne" />
              <Input label="Copyright text" name="footer_copyright"   defaultValue={s.footer_copyright}    placeholder="Crafyne Studio. All rights reserved." />
            </div>
          </section>

          <div className="pt-2 border-t border-black/8">
            <SubmitButton label="Save All Settings" />
          </div>
        </form>
      </div>
    </div>
  )
}
