"use client"

import { Board } from "@/components/kanban/board"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { useKanbanStore } from "@/lib/kanban-store"
import { AddColumnDialog } from "@/components/kanban/add-column-dialog"

export default function QuestLogClient() {
  const { addColumn } = useKanbanStore()
  return (
    <main className="disable-body-overflow-x disable-body-overflow-y mt-[115px] bg-muted/40">
      <header className="fixed w-full h-[55px] top-[60px] z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <div className="text-xl font-semibold">Kanban</div>
          <div className="ml-auto flex items-center gap-2">
            <AddColumnDialog
              trigger={
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Column
                </Button>
              }
              onSubmit={(title) => addColumn(title)}
            />
          </div>
        </div>
      </header>
      <Board />
    </main>
  )
}
