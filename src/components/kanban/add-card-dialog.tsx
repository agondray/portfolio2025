"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function AddCardDialog({
  trigger,
  onSubmit,
  mode = "create",
  initialTitle = "",
  initialDescription = "",
}: {
  trigger?: React.ReactNode
  onSubmit?: (title: string, description?: string) => void
  mode?: "create" | "edit"
  initialTitle?: string
  initialDescription?: string
}) {
  const [open, setOpen] = useState(false)
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

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        {trigger ?? <Button size="sm">{heading}</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{heading}</DialogTitle>
          <DialogDescription>{"Provide title and optional description."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Card title"
            aria-label="Card title"
            autoFocus
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            aria-label="Card description"
            rows={4}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{mode === "create" ? "Add" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
