'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import NextImage from 'next/image'
import { createClient } from '@/lib/supabase/client'

type Props = {
  label: string
  name: string
  defaultValue?: string[]
  folder?: string
  hint?: string
}

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml'
const MAX_BYTES = 10 * 1024 * 1024

function makeKey(folder: string, file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
  const stamp = Date.now().toString(36)
  const rand = Math.random().toString(36).slice(2, 8)
  return `${folder}/${stamp}-${rand}.${ext}`
}

export default function MultiImageUpload({
  label, name, defaultValue = [], folder = 'misc', hint,
}: Props) {
  const [urls, setUrls] = useState<string[]>(defaultValue)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [drag, setDrag] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setUrls(defaultValue) }, [defaultValue])

  const uploadOne = useCallback(async (file: File): Promise<string | null> => {
    if (!ACCEPT.split(',').includes(file.type)) {
      setError(`"${file.name}": file type not supported.`)
      return null
    }
    if (file.size > MAX_BYTES) {
      setError(`"${file.name}": too large (max 10 MB).`)
      return null
    }
    const supabase = createClient()
    const key = makeKey(folder, file)
    const { error: upErr } = await supabase.storage
      .from('media')
      .upload(key, file, { cacheControl: '31536000', upsert: false })
    if (upErr) {
      setError(`"${file.name}": ${upErr.message}`)
      return null
    }
    return supabase.storage.from('media').getPublicUrl(key).data.publicUrl
  }, [folder])

  const uploadMany = useCallback(async (files: File[]) => {
    setError(null)
    setBusy(true)
    try {
      const results = await Promise.all(files.map(uploadOne))
      const ok = results.filter((u): u is string => Boolean(u))
      if (ok.length) setUrls(prev => [...prev, ...ok])
    } finally {
      setBusy(false)
    }
  }, [uploadOne])

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length) uploadMany(files)
    e.target.value = ''
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDrag(false)
    const files = Array.from(e.dataTransfer.files ?? [])
    if (files.length) uploadMany(files)
  }

  function remove(idx: number) {
    setUrls(prev => prev.filter((_, i) => i !== idx))
  }

  function move(idx: number, dir: -1 | 1) {
    setUrls(prev => {
      const next = [...prev]
      const target = idx + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[idx], next[target]] = [next[target], next[idx]]
      return next
    })
  }

  function addUrlInput(value: string) {
    const trimmed = value.trim()
    if (trimmed) setUrls(prev => [...prev, trimmed])
  }

  return (
    <div>
      <label className="block text-xs font-medium text-[#555] mb-1.5 uppercase tracking-wide">
        {label}
      </label>

      {/* Hidden inputs — one per URL — server reads via formData.getAll(name) */}
      {urls.map((u, i) => (
        <input key={`${name}-${i}`} type="hidden" name={name} value={u} />
      ))}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        onChange={onPick}
        className="sr-only"
      />

      {/* Existing images grid */}
      {urls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
          {urls.map((url, i) => (
            <div key={`${url}-${i}`} className="group relative rounded-md overflow-hidden border border-black/12 bg-[#fafafa]">
              <div className="relative w-full aspect-[4/3]">
                <NextImage
                  src={url}
                  alt=""
                  fill
                  sizes="200px"
                  className="object-cover"
                  unoptimized={url.endsWith('.svg')}
                />
              </div>

              {/* Index badge */}
              <span className="absolute top-1.5 left-1.5 text-[10px] bg-white/90 text-[#111] px-1.5 py-0.5 rounded font-medium">
                {i + 1}
              </span>

              {/* Controls */}
              <div className="absolute inset-x-1.5 bottom-1.5 flex items-center justify-between gap-1 opacity-0 group-hover:opacity-100 transition">
                <div className="flex gap-0.5">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    title="Move up"
                    className="px-1.5 py-0.5 text-[11px] bg-white/90 text-[#111] rounded shadow-sm hover:bg-white transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === urls.length - 1}
                    title="Move down"
                    className="px-1.5 py-0.5 text-[11px] bg-white/90 text-[#111] rounded shadow-sm hover:bg-white transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="px-1.5 py-0.5 text-[11px] bg-white/90 text-[#c43] rounded shadow-sm hover:bg-white transition"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload dropzone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        disabled={busy}
        className={`w-full ${urls.length === 0 ? 'aspect-[16/9]' : 'py-6'} flex flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed transition ${
          drag
            ? 'border-[#7A9E89] bg-[#7A9E89]/5'
            : 'border-black/15 bg-[#fafafa] hover:border-black/30 hover:bg-white'
        } ${busy ? 'cursor-wait opacity-60' : 'cursor-pointer'}`}
      >
        {busy ? (
          <span className="text-sm text-[#555]">Uploading…</span>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
              className="text-[#888]">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
            <span className="text-sm text-[#555]">
              {urls.length === 0
                ? 'Click or drag images to upload'
                : 'Add more images'}
            </span>
            <span className="text-[11px] text-[#aaa]">Multiple files OK · JPG, PNG, WebP, GIF, SVG · max 10 MB each</span>
          </>
        )}
      </button>

      {/* URL fallback input */}
      <input
        type="url"
        placeholder="…or paste image URL and press Enter"
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault()
            addUrlInput(e.currentTarget.value)
            e.currentTarget.value = ''
          }
        }}
        className="mt-2 w-full px-3 py-1.5 text-xs border border-black/12 rounded-md bg-white text-[#666] placeholder:text-[#ccc] focus:outline-none focus:ring-2 focus:ring-[#7A9E89]/40 focus:border-[#7A9E89] transition"
      />

      {error && <p className="mt-1.5 text-xs text-[#c43]">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-[#aaa]">{hint}</p>}
    </div>
  )
}
