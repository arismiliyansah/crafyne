import Link from 'next/link'

interface Props {
  title: string
  backHref?: string
  action?: React.ReactNode
}

export default function AdminHeader({ title, backHref, action }: Props) {
  return (
    <div className="flex items-center justify-between gap-3 pl-16 pr-4 md:px-8 py-5 md:py-6 border-b border-black/8 bg-white">
      <div className="flex items-center gap-3 min-w-0">
        {backHref && (
          <Link href={backHref} className="text-sm text-[#888] hover:text-[#111] transition flex-shrink-0">
            ←
          </Link>
        )}
        <h1 className="font-serif text-lg md:text-xl text-[#111] tracking-[-0.01em] truncate">{title}</h1>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
