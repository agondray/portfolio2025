"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function AddColumnDialog({
  trigger,
  onSubmit,
}: {
  trigger?: React.ReactNode
  onSubmit?: (title: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!title.trim()) return
    onSubmit?.(title.trim())
    setTitle("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>{trigger ?? <Button size="sm">New Column</Button>}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{"New column"}</DialogTitle>
          <DialogDescription>{"Choose a name for the column."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Column title"
            aria-label="Column title"
            autoFocus
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
