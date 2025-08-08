"use client"

import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
  closestCenter,
  DragOverEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import { useKanbanStore } from "@/lib/kanban-store"
import { ColumnView } from "./column"
import { Button } from "@/components/ui/button"
import { RotateCcw } from 'lucide-react'

type ActiveData =
  | { type: "column"; columnId: string }
  | { type: "card"; cardId: string; fromColumnId: string }

export function Board() {
  const { columns, reset, reorderColumns, moveCard } = useKanbanStore()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function findCardColumn(cardId: string) {
    return columns.find((c) => c.cardIds.includes(cardId))
  }

  function handleDragStart(_event: DragStartEvent) {
    // No-op here; we attach needed metadata via useSortable data props on items
  }

  function handleDragOver(_event: DragOverEvent) {
    // Optional: could implement preview logic; skipping for simplicity
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return

    const activeType = (active.data.current as ActiveData | undefined)?.type
    const overType = (over.data.current as ActiveData | undefined)?.type

    // Columns sorting (horizontal)
    if (activeType === "column" && overType === "column") {
      const activeId = (active.data.current as ActiveData & { type: "column" }).columnId
      const overId = (over.data.current as ActiveData & { type: "column" }).columnId
      if (activeId !== overId) reorderColumns(activeId, overId)
      return
    }

    // Cards sorting / moving
    if (activeType === "card") {
      const cardId = (active.data.current as ActiveData & { type: "card" }).cardId
      const fromColId = (active.data.current as ActiveData & { type: "card" }).fromColumnId

      // If dropping over a card
      if ((over.data.current as ActiveData | undefined)?.type === "card") {
        const overCardId = (over.data.current as ActiveData & { type: "card" }).cardId
        const toColumn = findCardColumn(overCardId)
        if (!toColumn) return
        const toIndex = toColumn.cardIds.indexOf(overCardId)
        moveCard(cardId, fromColId, toColumn.id, toIndex)
        return
      }

      // If dropping over a column container (end of list)
      const toColumnId = (over.data.current as { type?: string; columnId?: string } | undefined)
        ?.columnId
      if (toColumnId) {
        const toColumn = columns.find((c) => c.id === toColumnId)
        if (!toColumn) return
        moveCard(cardId, fromColId, toColumn.id, toColumn.cardIds.length)
        return
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => reset()}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset demo data
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <SortableContext
          // Column ids for horizontal sorting
          items={columns.map((c) => c.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div
            className="flex gap-4 overflow-x-auto overflow-y-hidden pb-2 pr-6"
            aria-label="Kanban columns"
            role="list"
          >
            {columns.map((col) => (
              <ol key={col.id} className="shrink-0">
                <ColumnView columnId={col.id} />
              </ol>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
