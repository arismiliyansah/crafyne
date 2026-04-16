'use client'

interface Props {
  action: (id: string) => Promise<void>
  id: string
  label?: string
}

export default function DeleteButton({ action, id, label = 'Delete' }: Props) {
  async function handleClick() {
    if (!confirm('Are you sure you want to delete this?')) return
    await action(id)
  }

  return (
    <button
      onClick={handleClick}
      className="text-xs text-red-500 hover:text-red-700 transition"
    >
      {label}
    </button>
  )
}
