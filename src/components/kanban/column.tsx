"use client"

import { useMemo, useState } from "react"
import { useKanbanStore } from "@/lib/kanban-store"
import { CardItem } from "./card-item"
import { AddCardDialog } from "./add-card-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card as UICard, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import { useDroppable } from "@dnd-kit/core"
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { EditableText } from "./editable-text"
import { ConfirmDialog } from "./confirm-dialog"

export function ColumnView({ columnId = "" }: { columnId?: string }) {
  const { columns, addCard, renameColumn, deleteColumn } = useKanbanStore()
  const col = useMemo(() => columns.find((c) => c.id === columnId), [columns, columnId])

  const [isConfirmOpen, setConfirmOpen] = useState(false)

  // Draggable column
  const { attributes, listeners, transform, transition, setNodeRef: setSortableRef } = useSortable({
    id: columnId,
    data: { type: "column", columnId },
  })

  // Droppable area for cards when dropping at the end/empty
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: columnId,
    data: { type: "column-droppable", columnId },
  })

  if (!col) return null

  console.log('col: ', col)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <UICard
      ref={setSortableRef}
      style={style}
      className="bg-background border shadow-sm flex flex-col w-[320px] min-w-[320px] shrink-0 max-h-[var(--kanban-category-max-h)] overflow-y-auto py-0"
    >
      <CardHeader 
        className="flex flex-row items-center gap-2 py-3 cursor-pointer hover:bg-muted/50 transition-colors rounded-t-lg" 
        {...attributes} 
        {...listeners}
      >
        <CardTitle className="text-base font-semibold flex-1">
          <EditableText
            value={col.title}
            onChange={(v) => renameColumn(col.id, v)}
            ariaLabel="Column title"
          />
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open column menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Column</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <AddCardDialog
                trigger={
                  <div className="w-full flex items-center">
                    <Plus className="h-4 w-4 mr-2" /> Add card
                  </div>
                }
                onSubmit={(title, description) => addCard(col.id, title, description)}
              />
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setConfirmOpen(true)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete column
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="pt-0">
        <SortableContext items={col.cardIds} strategy={verticalListSortingStrategy}>
          <div ref={setDroppableRef} className="flex flex-col gap-2 min-h-[20px]">
            {col.cardIds.map((id) => (
              <li key={id}>
                <CardItem cardId={id} columnId={col.id} />
              </li>
            ))}
          </div>
        </SortableContext>

        <div className="mt-3">
          <AddCardDialog
            trigger={
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Add card
              </Button>
            }
            onSubmit={(title, description) => addCard(col.id, title, description)}
          />
        </div>
      </CardContent>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete column?"
        description="This will remove the column and all its cards. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => deleteColumn(col.id)}
      />
    </UICard>
  )
}
