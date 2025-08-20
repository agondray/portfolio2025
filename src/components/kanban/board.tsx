"use client"

import { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
  closestCorners,
  DragOverlay,
  defaultDropAnimationSideEffects,
  pointerWithin,
  type DragOverEvent,
  type DragEndEvent,
  type DragStartEvent,
  type DropAnimation,
} from "@dnd-kit/core"
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import { useKanbanStore } from "@/lib/kanban-store"
import { ColumnView } from "./column"
import { Button } from "@/components/ui/button"
import { ScrollArea, Scrollbar } from '@/components/ui/scroll-area'
import { ScrollBar } from '../ui/scroll-area';
import { CardItem } from './card-item';

type ActiveData = { type: "column"; columnId: string } | { type: "card"; cardId: string; fromColumnId: string }

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      }
    }
  })
}

export function Board() {
  const { columns, reorderColumns, moveCard, cards } = useKanbanStore()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeType, setActiveType] = useState<'card' | 'column' | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function findCardColumn(cardId: string) {
    return columns.find((c) => c.cardIds.includes(cardId))
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const data = active.data.current as ActiveData | undefined

    setActiveId(active.id as string)
    setActiveType(data?.type || null)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeData = active.data.current as ActiveData | undefined
    const overData = active.data.current as ActiveData | undefined

    if (activeData?.type === 'card' && overData?.type !== 'card') {
      const cardId = activeData.cardId
      const fromColId = activeData.fromColumnId
      let toColId: string | undefined

      if (overData?.type === 'column') {
        toColId = (overData as any).columnId
      } else if ((over.data.current as any)?.columnId) {
        toColId = (over.data.current as any).columnId
      }

      if (toColId && toColId !== fromColId) {
        const toCol = columns.find(col => col.id === toColId)

        if (toCol) {
          moveCard(cardId, fromColId, toColId, toCol.cardIds.length)
        }
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    setActiveId(null)
    setActiveType(null)

    if (!over) return

    const activeData = (active.data.current as ActiveData | undefined)
    const overData = (over.data.current as ActiveData | undefined)

    // Columns sorting (horizontal)
    if (activeData?.type === "column" && overData?.type === "column") {
      const activeColId = activeData.columnId
      const overId = overData.columnId

      if (activeColId !== overId) reorderColumns(activeColId, overId)
      return
    }

    // Cards sorting / moving
    if (activeData?.type === "card") {
      const cardId = activeData.cardId
      const fromColId = activeData.fromColumnId

      // If dropping over a card
      if (overData?.type === "card") {
        const overCardId = overData.cardId
        const toColumn = findCardColumn(overCardId)
        if (!toColumn) return
        const toIndex = toColumn.cardIds.indexOf(overCardId)
        moveCard(cardId, fromColId, toColumn.id, toIndex)
        return
      }

      // If dropping over a column container (end of list)
      const toColumnId = (over.data.current as { columnId?: string } | undefined)?.columnId
      if (toColumnId) {
        const toColumn = columns.find((c) => c.id === toColumnId)
        if (!toColumn) return
        moveCard(cardId, fromColId, toColumn.id, toColumn.cardIds.length)
        return
      }
    }
  }

  const activeCard = activeType === 'card' && activeId ? cards[activeId] : null
  const activeColumn = activeType === 'column' && activeId ? columns.find(col => col.id === activeId) : null

  return (
    <div className="flex flex-col gap-4 max-w-[1600px] mx-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <SortableContext
          // Column ids for horizontal sorting
          items={columns.map((col) => col.id)}
          strategy={horizontalListSortingStrategy}
        >
          <ScrollArea className="w-full">
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
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </SortableContext>

        {typeof window !== 'undefined' &&
          createPortal(
            <DragOverlay dropAnimation={dropAnimation}>
              {activeCard && (
                <div className="rotate-3 opacity-95">
                  <CardItem cardId={activeCard.id} columnId="" isDragOverlay />
                </div>
              )}
            </DragOverlay>,
            document.body,
          )        
        }
      </DndContext>
    </div>
  )
}
