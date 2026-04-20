'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Typography from '@tiptap/extension-typography'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml'
const MAX_BYTES = 10 * 1024 * 1024

async function uploadImage(file: File): Promise<string> {
  if (!ACCEPT.split(',').includes(file.type)) throw new Error('Unsupported file type')
  if (file.size > MAX_BYTES) throw new Error('File too large (max 10 MB)')
  const supabase = createClient()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
  const key = `blog/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from('media').upload(key, file, { cacheControl: '31536000', upsert: false })
  if (error) throw error
  return supabase.storage.from('media').getPublicUrl(key).data.publicUrl
}

// ── Icons ──────────────────────────────────────────────────────────────────
function Icon({ d, size = 14 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

// ── Toolbar button ─────────────────────────────────────────────────────────
function Btn({ onClick, active, title, children }: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={e => { e.preventDefault(); onClick() }}
      className={`p-1.5 rounded transition-colors ${
        active
          ? 'bg-[#111] text-white'
          : 'text-[#555] hover:bg-black/8 hover:text-[#111]'
      }`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-black/10 mx-0.5" />
}

// ── Link dialog ────────────────────────────────────────────────────────────
function LinkDialog({ onConfirm, onClose, initial }: {
  onConfirm: (url: string) => void
  onClose: () => void
  initial: string
}) {
  const [url, setUrl] = useState(initial)
  return (
    <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-black/12 rounded-lg shadow-lg p-3 flex gap-2 min-w-[280px]">
      <input
        autoFocus
        value={url}
        onChange={e => setUrl(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') onConfirm(url); if (e.key === 'Escape') onClose() }}
        placeholder="https://..."
        className="flex-1 text-sm px-2 py-1.5 border border-black/12 rounded focus:outline-none focus:border-[#4D8F6A]"
      />
      <button type="button" onClick={() => onConfirm(url)}
        className="px-3 py-1.5 bg-[#111] text-white text-sm rounded hover:opacity-80 transition">
        OK
      </button>
      <button type="button" onClick={onClose}
        className="px-2 py-1.5 text-sm text-[#888] hover:text-[#111] transition">
        ✕
      </button>
    </div>
  )
}

// ── Image dialog ───────────────────────────────────────────────────────────
function ImageDialog({ onConfirm, onClose }: {
  onConfirm: (url: string, alt: string) => void
  onClose: () => void
}) {
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setErr(null)
    setBusy(true)
    try {
      const uploaded = await uploadImage(file)
      setUrl(uploaded)
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-black/12 rounded-lg shadow-lg p-3 flex flex-col gap-2 min-w-[320px]">
      <input ref={fileRef} type="file" accept={ACCEPT} onChange={onPickFile} className="sr-only" />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={busy}
        className={`text-xs py-2 px-3 rounded border border-dashed text-center transition ${
          busy ? 'border-black/10 text-[#aaa]' : 'border-black/20 text-[#555] hover:border-[#7A9E89] hover:text-[#111]'
        }`}
      >
        {busy ? 'Uploading…' : '↑ Upload from computer'}
      </button>
      <div className="flex items-center gap-2 text-[10px] text-[#bbb] uppercase tracking-wider">
        <span className="flex-1 h-px bg-black/8" />or<span className="flex-1 h-px bg-black/8" />
      </div>
      <input autoFocus value={url} onChange={e => setUrl(e.target.value)}
        placeholder="Paste image URL (https://...)"
        className="text-sm px-2 py-1.5 border border-black/12 rounded focus:outline-none focus:border-[#4D8F6A]" />
      <input value={alt} onChange={e => setAlt(e.target.value)}
        placeholder="Alt text (optional)"
        className="text-sm px-2 py-1.5 border border-black/12 rounded focus:outline-none focus:border-[#4D8F6A]" />
      {err && <p className="text-xs text-[#c43]">{err}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={() => url && onConfirm(url, alt)}
          disabled={!url || busy}
          className="flex-1 py-1.5 bg-[#111] text-white text-sm rounded hover:opacity-80 transition disabled:opacity-40">
          Insert
        </button>
        <button type="button" onClick={onClose}
          className="px-3 py-1.5 text-sm text-[#888] hover:text-[#111] transition">
          Cancel
        </button>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export default function RichTextEditor({
  name = 'content',
  defaultValue = '',
  placeholder = 'Start writing...',
}: {
  name?: string
  defaultValue?: string
  placeholder?: string
}) {
  const [linkDialog, setLinkDialog] = useState(false)
  const [imageDialog, setImageDialog] = useState(false)
  const toolbarRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: false,
        underline: false,
      }),
      Underline,
      Typography,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Image.configure({ HTMLAttributes: { class: 'rounded-md max-w-full' } }),
    ],
    content: defaultValue,
    editorProps: {
      attributes: {
        class: 'prose-editor focus:outline-none min-h-[360px] px-5 py-4 text-[14.5px] leading-relaxed text-[#111]',
      },
    },
  })

  // Keep hidden input in sync
  const [html, setHtml] = useState(defaultValue)
  useEffect(() => {
    if (!editor) return
    const update = () => setHtml(editor.getHTML())
    editor.on('update', update)
    return () => { editor.off('update', update) }
  }, [editor])

  if (!editor) return null

  // ── Link handlers ────────────────────────────────────────────────────────
  const currentLink = editor.getAttributes('link').href ?? ''
  function applyLink(url: string) {
    if (!url) { editor!.chain().focus().unsetLink().run(); setLinkDialog(false); return }
    editor!.chain().focus().setLink({ href: url }).run()
    setLinkDialog(false)
  }
  function applyImage(url: string, alt: string) {
    editor!.chain().focus().setImage({ src: url, alt }).run()
    setImageDialog(false)
  }

  return (
    <div>
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={html} />

      <div className="border border-black/12 rounded-lg overflow-hidden bg-white">
        {/* Toolbar */}
        <div ref={toolbarRef}
          className="relative flex items-center gap-0.5 px-3 py-2 border-b border-black/8 bg-[#fafafa] overflow-x-auto whitespace-nowrap">

          {/* Undo / Redo */}
          <Btn title="Undo" onClick={() => editor.chain().focus().undo().run()}>
            <Icon d="M3 7v6h6M3.51 15A9 9 0 1 0 5 5.51" />
          </Btn>
          <Btn title="Redo" onClick={() => editor.chain().focus().redo().run()}>
            <Icon d="M21 7v6h-6M20.49 15A9 9 0 1 1 19 5.51" />
          </Btn>

          <Divider />

          {/* Headings */}
          {([1, 2, 3] as const).map(level => (
            <Btn key={level} title={`Heading ${level}`}
              active={editor.isActive('heading', { level })}
              onClick={() => editor.chain().focus().toggleHeading({ level }).run()}>
              <span className="text-[11px] font-bold">H{level}</span>
            </Btn>
          ))}
          <Btn title="Paragraph" active={editor.isActive('paragraph')}
            onClick={() => editor.chain().focus().setParagraph().run()}>
            <Icon d="M13 4H8.5A3.5 3.5 0 0 0 5 7.5v0A3.5 3.5 0 0 0 8.5 11H13m0-7v16m4-16v16" />
          </Btn>

          <Divider />

          {/* Inline styles */}
          <Btn title="Bold" active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}>
            <span className="text-[13px] font-black">B</span>
          </Btn>
          <Btn title="Italic" active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}>
            <span className="text-[13px] italic font-semibold">I</span>
          </Btn>
          <Btn title="Underline" active={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <span className="text-[13px] font-semibold underline">U</span>
          </Btn>
          <Btn title="Strikethrough" active={editor.isActive('strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()}>
            <span className="text-[13px] font-semibold line-through">S</span>
          </Btn>
          <Btn title="Inline code" active={editor.isActive('code')}
            onClick={() => editor.chain().focus().toggleCode().run()}>
            <Icon d="M8 9l-3 3 3 3M16 9l3 3-3 3" />
          </Btn>

          <Divider />

          {/* Alignment */}
          <Btn title="Align left" active={editor.isActive({ textAlign: 'left' })}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}>
            <Icon d="M3 6h18M3 12h12M3 18h15" />
          </Btn>
          <Btn title="Align center" active={editor.isActive({ textAlign: 'center' })}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}>
            <Icon d="M3 6h18M6 12h12M4 18h16" />
          </Btn>
          <Btn title="Align right" active={editor.isActive({ textAlign: 'right' })}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}>
            <Icon d="M3 6h18M9 12h12M6 18h15" />
          </Btn>

          <Divider />

          {/* Lists */}
          <Btn title="Bullet list" active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <Icon d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
          </Btn>
          <Btn title="Ordered list" active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <Icon d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10H3M4 18H3m1 0h1" />
          </Btn>

          <Divider />

          {/* Block elements */}
          <Btn title="Blockquote" active={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <Icon d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
          </Btn>
          <Btn title="Code block" active={editor.isActive('codeBlock')}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
            <Icon d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
          </Btn>
          <Btn title="Horizontal rule"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <Icon d="M5 12h14" />
          </Btn>

          <Divider />

          {/* Link */}
          <div className="relative">
            <Btn title="Link" active={editor.isActive('link')}
              onClick={() => { setImageDialog(false); setLinkDialog(v => !v) }}>
              <Icon d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </Btn>
            {linkDialog && (
              <LinkDialog initial={currentLink} onConfirm={applyLink} onClose={() => setLinkDialog(false)} />
            )}
          </div>
          {editor.isActive('link') && (
            <Btn title="Remove link" onClick={() => editor.chain().focus().unsetLink().run()}>
              <Icon d="M18.84 12.25l1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71m-3.36 3.36L8.73 9.17a5 5 0 0 0 0 7.07 5 5 0 0 0 7.07 0l1.71-1.71m-10.5.85l12-12" />
            </Btn>
          )}

          {/* Image */}
          <div className="relative">
            <Btn title="Image"
              onClick={() => { setLinkDialog(false); setImageDialog(v => !v) }}>
              <Icon d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8.5 10a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm10.5 5l-5-5-7 7" />
            </Btn>
            {imageDialog && (
              <ImageDialog onConfirm={applyImage} onClose={() => setImageDialog(false)} />
            )}
          </div>

          <Divider />

          {/* Clear formatting */}
          <Btn title="Clear formatting"
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
            <Icon d="M4 7V4h16v3M9 20h6M12 4v16M5 4l14 14" />
          </Btn>
        </div>

        {/* Editor area */}
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
