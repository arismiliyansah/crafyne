import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getCaseStudyBySlug, getCaseStudies } from '@/lib/supabase/queries'
import Nav from '@/components/public/Nav'
import BackToTop from '@/components/public/BackToTop'

export const revalidate = 60

export async function generateStaticParams() {
  const items = await getCaseStudies(true, true)
  return items.map(cs => ({ slug: cs.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const cs = await getCaseStudyBySlug(slug)
  return { title: cs?.client ?? 'Case Study', description: cs?.outcome ?? '' }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cs = await getCaseStudyBySlug(slug)
  if (!cs) notFound()

  return (
    <>
      <Nav />
      <BackToTop />
      <main className="pt-28 pb-32">
        <div className="max-w-[860px] mx-auto px-8">

          {/* Back */}
          <Link href="/#work" className="text-[13px] text-ink-3 hover:text-ink transition mb-12 inline-flex items-center gap-1.5">
            ← Work
          </Link>

          {/* Header */}
          <div className="mt-6 mb-16">
            <p className="text-[12px] font-medium tracking-[0.11em] uppercase text-accent mb-4">{cs.year}</p>
            <h1 className="font-serif text-[clamp(36px,5vw,64px)] leading-[1.08] tracking-[-0.025em] mb-4">{cs.client}</h1>
            {cs.outcome && (
              <p className="text-[18px] text-ink-2 font-light leading-[1.6]">{cs.outcome}</p>
            )}
          </div>

          {/* Cover */}
          {cs.cover_image_url && (
            <div className="relative mb-16 rounded-[4px] overflow-hidden aspect-[16/8]">
              <Image src={cs.cover_image_url} alt={cs.client} fill sizes="(max-width: 768px) 100vw, 860px" className="object-cover" />
            </div>
          )}

          {/* Tags */}
          {cs.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-14">
              {cs.tags.map(tag => (
                <span key={tag} className="text-[12px] text-ink-3 bg-black/5 px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="space-y-14">
            {cs.challenge && (
              <section>
                <h2 className="font-serif text-[22px] tracking-[-0.01em] mb-5">The Challenge</h2>
                <p className="text-[15.5px] text-ink-2 leading-[1.78] font-light whitespace-pre-wrap">{cs.challenge}</p>
              </section>
            )}
            {cs.solution && (
              <section>
                <h2 className="font-serif text-[22px] tracking-[-0.01em] mb-5">The Solution</h2>
                <p className="text-[15.5px] text-ink-2 leading-[1.78] font-light whitespace-pre-wrap">{cs.solution}</p>
              </section>
            )}
          </div>

          {/* Gallery */}
          {cs.gallery_urls?.length > 0 && (
            <div className="mt-16 grid grid-cols-2 gap-4">
              {cs.gallery_urls.map((url, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-[3px] overflow-hidden">
                  <Image src={url} alt={`${cs.client} ${i + 1}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Live project link */}
          {cs.project_url && (
            <div className="mt-14 pt-10 border-t border-black/8">
              <a
                href={cs.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[14px] font-medium text-ink border-b border-ink/25 pb-px hover:border-ink/60 transition group"
              >
                View live project
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          )}

        </div>
      </main>
    </>
  )
}
