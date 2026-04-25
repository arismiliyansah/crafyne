'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import NextImage from 'next/image'
import { createClient } from '@/lib/supabase/client'

type Props = {
  label: string
  name: string
  defaultValue?: string
  folder?: string
  hint?: string
  aspect?: string
}

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml'
const MAX_BYTES = 10 * 1024 * 1024

function makeKey(folder: string, file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
  const stamp = Date.now().toString(36)
  const rand = Math.random().toString(36).slice(2, 8)
  return `${folder}/${stamp}-${rand}.${ext}`
}

export default function ImageUpload({
  label, name, defaultValue = '', folder = 'misc', hint, aspect = 'aspect-[16/9]',
}: Props) {
  const [url, setUrl] = useState(defaultValue)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [drag, setDrag] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setUrl(defaultValue) }, [defaultValue])

  const upload = useCallback(async (file: File) => {
    setError(null)
    if (!ACCEPT.split(',').includes(file.type)) {
      setError('File type not supported. Use JPG, PNG, WebP, GIF, or SVG.')
      return
    }
    if (file.size > MAX_BYTES) {
      setError('File too large. Max 10 MB.')
      return
    }

    setBusy(true)
    try {
      const supabase = createClient()
      const key = makeKey(folder, file)
      const { error: upErr } = await supabase.storage
        .from('media')
        .upload(key, file, { cacheControl: '31536000', upsert: false })
      if (upErr) throw upErr
      const { data } = supabase.storage.from('media').getPublicUrl(key)
      setUrl(data.publicUrl)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }, [folder])

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) upload(file)
    e.target.value = ''
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDrag(false)
    const file = e.dataTransfer.files?.[0]
    if (file) upload(file)
  }

  function clear() {
    setUrl('')
    setError(null)
  }

  return (
    <div>
      <label className="block text-xs font-medium text-[#555] mb-1.5 uppercase tracking-wide">
        {label}
      </label>

      <input type="hidden" name={name} value={url} />
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={onPick}
        className="sr-only"
      />

      {url ? (
        <div className="relative group rounded-md overflow-hidden border border-black/12 bg-[#fafafa]">
          <div className={`relative w-full ${aspect}`}>
            <NextImage
              src={url}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              className="object-cover"
              unoptimized={url.endsWith('.svg')}
            />
          </div>
          <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-2.5 py-1 text-[11px] bg-white/90 backdrop-blur text-[#111] rounded shadow-sm hover:bg-white transition"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={clear}
              className="px-2.5 py-1 text-[11px] bg-white/90 backdrop-blur text-[#c43] rounded shadow-sm hover:bg-white transition"
            >
              Remove
            </button>
          </div>
          {busy && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-xs text-[#555]">
              Uploading…
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          disabled={busy}
          className={`w-full ${aspect} flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed transition ${
            drag
              ? 'border-[#7A9E89] bg-[#7A9E89]/5'
              : 'border-black/15 bg-[#fafafa] hover:border-black/30 hover:bg-white'
          } ${busy ? 'cursor-wait opacity-60' : 'cursor-pointer'}`}
        >
          {busy ? (
            <span className="text-sm text-[#555]">Uploading…</span>
          ) : (
            <>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
                className="text-[#888]">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
              <span className="text-sm text-[#555]">
                Click or drag image to upload
              </span>
              <span className="text-[11px] text-[#aaa]">JPG, PNG, WebP, GIF, SVG · max 10 MB</span>
            </>
          )}
        </button>
      )}

      <input
        type="url"
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="…or paste URL"
        className="mt-2 w-full px-3 py-1.5 text-xs border border-black/12 rounded-md bg-white text-[#666] placeholder:text-[#ccc] focus:outline-none focus:ring-2 focus:ring-[#7A9E89]/40 focus:border-[#7A9E89] transition"
      />

      {error && <p className="mt-1.5 text-xs text-[#c43]">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-[#aaa]">{hint}</p>}
    </div>
  )
}
