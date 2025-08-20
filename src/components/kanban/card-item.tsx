"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { clsx } from 'clsx';
import { useKanbanStore } from "@/lib/kanban-store"
import { Card as UICard, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react'
import { AddCardDialog } from "./add-card-dialog"
import { useState } from "react"
import { ConfirmDialog } from "./confirm-dialog"

type CardItemType = {
  cardId?: string,
  columnId?: string,
  isDragOverlay?: boolean
}

export function CardItem({
  cardId = "",
  columnId = "",
  isDragOverlay = false,
}: CardItemType) {
  const { cards, updateCard, deleteCard } = useKanbanStore()
  const card = cards[cardId]
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [addCardDialogOpen, setAddCardDialogOpen] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: cardId,
    data: { type: "card", cardId, fromColumnId: columnId },
    disabled: isDragOverlay,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (!card) return null

  return (
      <div
        ref={setNodeRef}
        style={style}
        {...(isDragOverlay ? {} : {...attributes, ...listeners})}
      >
        <UICard className={`
          border
          bg-card
          transition-all
          ${!isDragOverlay ? "cursor-pointer hover:shadow-md" : ""}
          ${isDragging && !isDragOverlay ? "opacity-50" : ""}
        `}>
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <div className="flex-1 select-none">
                <div className="font-medium">{card.title}</div>
                {card.description ? (
                  <div className="text-sm">{card.description}</div>
                ) : null}
              </div>
              {!isDragOverlay && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={e => e.stopPropagation()}>
                      <EllipsisVertical className="h-4 w-4" />
                      <span className="sr-only">Open card menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[180px]">
                    <DropdownMenuItem onSelect={() => {setAddCardDialogOpen(true)}}>
                      <div className="w-full flex items-center" role="button">
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setConfirmOpen(true)}>
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>                
              )}
            </div>
          </CardContent>
        </UICard>
        {addCardDialogOpen && (
          <AddCardDialog
            mode="edit"
            initialTitle={card.title}
            initialDescription={card.description}
            onSubmit={(title, description) => updateCard(card.id, { title, description })}
            open={addCardDialogOpen}
            setOpen={setAddCardDialogOpen}
          />
        )}
        {!isDragOverlay && (
          <ConfirmDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title="Delete card?"
            description="This will remove the card. This action cannot be undone."
            confirmLabel="Delete"
            onConfirm={() => deleteCard(columnId, cardId)}
          />
        )}
      </div>
  )
}
