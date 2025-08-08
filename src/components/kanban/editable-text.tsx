"use client"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"

export function EditableText({
  value = "",
  onChange,
  ariaLabel = "Editable text",
}: {
  value?: string
  onChange?: (v: string) => void
  ariaLabel?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  useEffect(() => {
    setDraft(value)
  }, [value])

  function save() {
    const v = draft.trim()
    if (v && v !== value) onChange?.(v)
    setEditing(false)
  }

  function cancel() {
    setDraft(value)
    setEditing(false)
  }

  if (editing) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          save()
        }}
        className="flex items-center gap-2"
      >
        <Input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          aria-label={ariaLabel}
          className="h-8"
        />
      </form>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="text-left w-full hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring rounded"
      aria-label={`${ariaLabel}, current value: ${value}`}
    >
      {value || "Untitled"}
    </button>
  )
}
