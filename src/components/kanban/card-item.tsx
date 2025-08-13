"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useKanbanStore } from "@/lib/kanban-store"
import { Card as UICard, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react'
import { AddCardDialog } from "./add-card-dialog"
import { useState } from "react"
import { ConfirmDialog } from "./confirm-dialog"

export function CardItem({ cardId = "", columnId = "" }: { cardId?: string; columnId?: string }) {
  const { cards, updateCard, deleteCard } = useKanbanStore()
  const card = cards[cardId]
  const [confirmOpen, setConfirmOpen] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: cardId,
    data: { type: "card", cardId, fromColumnId: columnId },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (!card) return null

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <UICard className="border bg-card cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <div className="font-medium">{card.title}</div>
              {card.description ? (
                <div className="text-sm text-muted-foreground line-clamp-3">{card.description}</div>
              ) : null}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <EllipsisVertical className="h-4 w-4" />
                  <span className="sr-only">Open card menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[180px]">
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <AddCardDialog
                    mode="edit"
                    initialTitle={card.title}
                    initialDescription={card.description}
                    trigger={
                      <div className="w-full flex items-center">
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                      </div>
                    }
                    onSubmit={(title, description) => updateCard(card.id, { title, description })}
                  />
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setConfirmOpen(true)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </UICard>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete card?"
        description="This will remove the card. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => deleteCard(columnId, cardId)}
      />
    </div>
  )
}
