interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
  hint?: string
}
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  name: string
  hint?: string
  rows?: number
}

const inputClass =
  'w-full px-3 py-2 text-sm border border-black/12 rounded-md bg-white text-[#111] placeholder:text-[#ccc] focus:outline-none focus:ring-2 focus:ring-[#7A9E89]/40 focus:border-[#7A9E89] transition'

export function Input({ label, name, hint, ...props }: InputProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#555] mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <input name={name} className={inputClass} {...props} />
      {hint && <p className="mt-1 text-xs text-[#aaa]">{hint}</p>}
    </div>
  )
}

export function Textarea({ label, name, hint, rows = 4, ...props }: TextareaProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#555] mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <textarea name={name} rows={rows} className={`${inputClass} resize-y`} {...props} />
      {hint && <p className="mt-1 text-xs text-[#aaa]">{hint}</p>}
    </div>
  )
}

export function Toggle({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} className="sr-only peer" />
        <div className="w-9 h-5 bg-black/10 rounded-full peer-checked:bg-[#7A9E89] transition" />
        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition peer-checked:translate-x-4" />
      </div>
      <span className="text-sm text-[#555] group-hover:text-[#111] transition">{label}</span>
    </label>
  )
}

export function SubmitButton({ label = 'Save' }: { label?: string }) {
  return (
    <button
      type="submit"
      className="bg-[#111] text-[#F5F4F0] px-6 py-2.5 rounded-md text-sm font-medium hover:opacity-80 transition"
    >
      {label}
    </button>
  )
}
