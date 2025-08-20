"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function AddCardDialog({
  trigger,
  onSubmit,
  mode = "create",
  initialTitle = "",
  initialDescription = "",
  open = false,
  setOpen = () => false,
}: {
  trigger?: React.ReactNode
  onSubmit?: (title: string, description?: string) => void
  mode?: "create" | "edit"
  initialTitle?: string
  initialDescription?: string
  open?: boolean
  setOpen?: (val: boolean) => void
}) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)

  const heading = mode === "create" ? "Add card" : "Edit card"

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!title.trim()) return
    onSubmit?.(title.trim(), description.trim() ? description.trim() : undefined)
    if (mode === "create") {
      setTitle("")
      setDescription("")
    }
    setOpen(false)
  }

  const handleCancel = () => {
    setTitle(initialTitle)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        {(mode === 'create' && trigger) ?? <Button size="sm">{heading}</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{heading}</DialogTitle>
          <DialogDescription>{"Provide title and optional description."}</DialogDescription>
          <DialogClose />
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-3"
          onKeyDown={e => e.stopPropagation()}
        >
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Card title"
            aria-label="Card title"
            type="text"
            maxLength={40}
          />
          <Textarea
            className="resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            aria-label="Card description"
            rows={4}
            maxLength={100}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">{mode === "create" ? "Add" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
