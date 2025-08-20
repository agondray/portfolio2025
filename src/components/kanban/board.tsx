"use client"

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
  closestCenter,
} from "@dnd-kit/core"
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import { useKanbanStore } from "@/lib/kanban-store"
import { ColumnView } from "./column"

type ActiveData =
  | { type: "column"; columnId: string }
  | { type: "card"; cardId: string; fromColumnId: string }

export function Board() {
  const { columns, reorderColumns, moveCard } = useKanbanStore()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function findCardColumn(cardId: string) {
    return columns.find((c) => c.cardIds.includes(cardId))
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
    <div className="flex flex-col gap-4 max-w-[1600px] mx-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          // Column ids for horizontal sorting
          items={columns.map((c) => c.id)}
          strategy={horizontalListSortingStrategy}
        >
          <ol
            className="flex list-none transition ease-in duration-150 bg-linear-to-br from-[var(--color-grad-from)] to-[var(--color-grad-to)] pt-[9rem] fixed top-0 bottom-0 left-0 right-0 gap-4 overflow-x-auto overflow-y-hidden pl-[1rem]"
            aria-label="Kanban columns"
            role="list"
          >
            {columns.map((col) => (
              <li key={col.id} className="shrink-0">
                <ColumnView columnId={col.id} />
              </li>
            ))}
          </ol>
        </SortableContext>
      </DndContext>
    </div>
  )
}
