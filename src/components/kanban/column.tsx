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
import { Card as UICard, CardHeader, CardFooter, CardTitle, CardContent } from "@/components/ui/card"
import { MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import { useDroppable } from "@dnd-kit/core"
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { EditableText } from "./editable-text"
import { ConfirmDialog } from "./confirm-dialog"

type ColumnViewType = {
  columnId?: string,
  isDragOverlay?: boolean,
}


export function ColumnView({
  columnId = "",
  isDragOverlay = false,
}: ColumnViewType) {
  const {
    columns,
    addCard,
    renameColumn,
    deleteColumn
  } = useKanbanStore()

  const col = useMemo(() => columns.find((c) => c.id === columnId), [columns, columnId])

  const [isConfirmOpen, setConfirmOpen] = useState(false)
  const [addCardDialogOpen, setAddCardDialogOpen] = useState(false)
  
  // Draggable column
  const {
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    setNodeRef: setSortableRef
  } = useSortable({
    id: columnId,
    data: { type: "column", columnId },
    disabled: isDragOverlay,
  })

  // Droppable area for cards when dropping at the end/empty
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: columnId,
    data: { type: "column-droppable", columnId },
    disabled: isDragOverlay,
  })

  if (!col) return null

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <UICard
      ref={setSortableRef}
      style={style} 
      className={`bg-background/80 border shadow-sm flex flex-col w-[320px] min-w-[320px] shrink-0 max-h-[var(--kanban-category-max-h)] overflow-y-auto overflow-x-hidden py-0 gap-0 ${isDragging && !isDragOverlay ? 'opacity-50' : ''} ${isOver ? 'ring-2 ring-primary/50' : ''}`}
    >
      <CardHeader 
        className={`flex flex-row items-center gap-2 mb-3 border-b border-foreground/25 py-2 rounded-t-lg ${!isDragOverlay ? 'cursor-pointer hover:bg-muted/50' : ''}`} 
        {...attributes} 
        {...listeners}
      >
        <CardTitle className="text-base font-semibold flex-1">
          {isDragOverlay ? (
            <span>{col.title}</span>
          ) : (
            <EditableText value={col.title} onChange={(v) => renameColumn(col.id, v)} ariaLabel="Column title" />
          )}
        </CardTitle>
        {!isDragOverlay && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" onClick={e => e.stopPropagation()}>
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open column menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Column Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={e => e.preventDefault()}>
                <AddCardDialog
                  trigger={
                    <div className="w-full flex items-center">
                      <Plus className="h-4 w-4 mr-2" /> Add card
                    </div>
                  }
                  onSubmit={(title, description) => addCard(col.id, title, description)}
                  open={addCardDialogOpen}
                  setOpen={setAddCardDialogOpen}
                />
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setConfirmOpen(true)}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> 
        )}
      </CardHeader>

      <CardContent ref={setDroppableRef} className="pt-0 overflow-x-hidden">
        <SortableContext items={col.cardIds} strategy={verticalListSortingStrategy}>
          <div ref={setDroppableRef} className={`flex flex-col gap-2 min-h-[20px] transition-colors rounded ${isOver ? 'bg-muted/30' : ''}`}>
            {col.cardIds.map((id) => (
              <CardItem key={id} cardId={id} columnId={col.id} />
            ))}
          </div>
        </SortableContext>
      </CardContent>

      {!isDragOverlay && (
        <CardFooter className="flex items-start mt-3 py-3 border-t border-foreground/25">
          <AddCardDialog
            trigger={
              <Button variant="ghost" size="sm" className="w-full justify-start has-[>svg]:px-0">
                <Plus className="h-4 w-4 mr-2" />
                Add Card
              </Button>
            }
            onSubmit={(title, description) => addCard(col.id, title, description)}
            open={addCardDialogOpen}
            setOpen={setAddCardDialogOpen}
          />
        </CardFooter>
      )}

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
