import Link from 'next/link'

interface Props {
  title: string
  backHref?: string
  action?: React.ReactNode
}

export default function AdminHeader({ title, backHref, action }: Props) {
  return (
    <div className="flex items-center justify-between px-8 py-6 border-b border-black/8 bg-white">
      <div className="flex items-center gap-3">
        {backHref && (
          <Link href={backHref} className="text-sm text-[#888] hover:text-[#111] transition">
            ←
          </Link>
        )}
        <h1 className="font-serif text-xl text-[#111] tracking-[-0.01em]">{title}</h1>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
