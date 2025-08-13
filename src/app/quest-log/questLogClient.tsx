"use client"

import { Board } from "@/components/kanban/board"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { useKanbanStore } from "@/lib/kanban-store"
import { AddColumnDialog } from "@/components/kanban/add-column-dialog"
import { RotateCcw } from 'lucide-react'

export default function QuestLogClient() {
  const { addColumn, reset } = useKanbanStore()
  return (
    <main className="disable-body-overflow-x disable-body-overflow-y mt-[60px] bg-muted/40">
      <header className="fixed w-full h-[55px] top-[60px] z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="mx-auto px-4 py-3 flex items-center gap-3">
          <h1 className="text-l md:text-xl font-semibold">Quest Log</h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => reset()} className="cursor-pointer">
                <RotateCcw className="h-4 w-4" />
                Reset demo data
              </Button>
            </div>
            <AddColumnDialog
              trigger={
                <Button size="sm" className="cursor-pointer">
                  <Plus className="h-4 w-4" />
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
