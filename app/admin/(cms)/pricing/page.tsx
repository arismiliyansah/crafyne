import { createClient } from '@/lib/supabase/server'
import AdminHeader from '@/components/admin/AdminHeader'
import DeleteButton from '@/components/admin/DeleteButton'
import { Input, Textarea, Toggle, SubmitButton } from '@/components/admin/FormField'
import { upsertPricingTier, deletePricingTier } from '@/lib/actions/content'

export default async function PricingPage() {
  const supabase = await createClient()
  const { data: items } = await supabase.from('pricing_tiers').select('*').order('display_order', { ascending: true })

  return (
    <div>
      <AdminHeader title="Pricing" />
      <div className="p-4 sm:p-6 md:p-8 max-w-3xl space-y-8">

        {items?.map(t => (
          <div key={t.id} className="bg-white border border-black/8 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-medium text-[#111]">{t.name} {t.featured && <span className="text-[10px] bg-[#7A9E89]/15 text-[#7A9E89] px-1.5 py-0.5 rounded uppercase tracking-wide">Featured</span>}</p>
                <p className="text-xs text-[#888]">${t.price} {t.unit}</p>
              </div>
              <DeleteButton action={deletePricingTier} id={t.id} />
            </div>
            <form action={upsertPricingTier} className="space-y-4">
              <input type="hidden" name="id" value={t.id} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Name" name="name" required defaultValue={t.name} />
                <Input label="Tag" name="tag" defaultValue={t.tag ?? ''} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input label="Price" name="price" required defaultValue={t.price} />
                <Input label="Unit" name="unit" defaultValue={t.unit ?? ''} hint="USD / mo" />
                <Input label="Tone" name="tone" defaultValue={t.tone} hint="cream·crimson·navy" />
              </div>
              <Textarea label="Blurb" name="blurb" rows={2} defaultValue={t.blurb ?? ''} />
              <Textarea label="Features" name="features" rows={5} hint="One per line" defaultValue={(t.features ?? []).join('\n')} />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Input label="CTA label" name="cta_label" defaultValue={t.cta_label} />
                  <Input label="Order" name="display_order" type="number" defaultValue={t.display_order} />
                  <Toggle label="Featured" name="featured" defaultChecked={t.featured} />
                </div>
                <SubmitButton label="Save" />
              </div>
            </form>
          </div>
        ))}

        <details className="bg-white border border-black/8 rounded-lg overflow-hidden">
          <summary className="px-6 py-4 text-sm font-medium text-[#555] cursor-pointer hover:text-[#111] transition list-none flex items-center justify-between">
            + Add new tier
            <span className="text-[#ccc]">▾</span>
          </summary>
          <div className="px-6 pb-6 pt-2 border-t border-black/8">
            <form action={upsertPricingTier} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Name" name="name" required placeholder="Sprint" />
                <Input label="Tag" name="tag" placeholder="Two weeks, fixed scope" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input label="Price" name="price" required placeholder="12,500" />
                <Input label="Unit" name="unit" placeholder="USD" />
                <Input label="Tone" name="tone" defaultValue="cream" hint="cream·crimson·navy" />
              </div>
              <Textarea label="Blurb" name="blurb" rows={2} placeholder="Short description..." />
              <Textarea label="Features" name="features" rows={5} hint="One per line" placeholder={'1 designer + 1 engineer\n10 working days\n30-day Slack support'} />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Input label="CTA label" name="cta_label" defaultValue="Get started" />
                  <Input label="Order" name="display_order" type="number" defaultValue="0" />
                  <Toggle label="Featured" name="featured" />
                </div>
                <SubmitButton label="Add tier" />
              </div>
            </form>
          </div>
        </details>

      </div>
    </div>
  )
}
