"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export type ID = string

export type Card = {
  id: ID
  title: string
  description?: string
  createdAt: number
  updatedAt?: number
}

export type Column = {
  id: ID
  title: string
  cardIds: ID[]
}

type BoardState = {
  columns: Column[]
  cards: Record<ID, Card>
  // Actions
  addColumn: (title: string) => ID
  renameColumn: (columnId: ID, title: string) => void
  deleteColumn: (columnId: ID) => void
  reorderColumns: (activeId: ID, overId: ID) => void
  addCard: (columnId: ID, title: string, description?: string) => ID
  updateCard: (cardId: ID, updates: Partial<Omit<Card, "id" | "createdAt">>) => void
  deleteCard: (columnId: ID, cardId: ID) => void
  moveCard: (cardId: ID, fromColumnId: ID, toColumnId: ID, toIndex: number) => void
  reorderCardInColumn: (columnId: ID, activeId: ID, overId: ID) => void
  reset: () => void
}

// Simple id generator
function uid(prefix = "id"): ID {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

function seed(): Pick<BoardState, "columns" | "cards"> {
  const todo: Column = { id: uid("col"), title: "To Do", cardIds: [] }
  const doing: Column = { id: uid("col"), title: "In Progress", cardIds: [] }
  const done: Column = { id: uid("col"), title: "Done", cardIds: [] }
  const cards: Record<ID, Card> = {}

  const addCard = (col: Column, title: string, description?: string) => {
    const id = uid("card")
    cards[id] = { id, title, description, createdAt: Date.now() }
    col.cardIds.push(id)
  }

  addCard(todo, "Design landing page", "Draft hero and features sections.")
  addCard(todo, "Collect requirements", "Sync with stakeholders.")
  addCard(doing, "Build auth", "Email/password with validation.")
  addCard(done, "Project setup", "Create Next.js app and UI library.")

  return { columns: [todo, doing, done], cards }
}

export const useKanbanStore = create<BoardState>()(
  persist(
    (set, get) => ({
      ...seed(),
      addColumn: (title) => {
        const id = uid("col")
        set((state) => ({ columns: [...state.columns, { id, title, cardIds: [] }] }))
        return id
      },
      renameColumn: (columnId, title) =>
        set((state) => ({
          columns: state.columns.map((c) => (c.id === columnId ? { ...c, title } : c)),
        })),
      deleteColumn: (columnId) =>
        set((state) => {
          const col = state.columns.find((c) => c.id === columnId)
          if (!col) return {}
          const newCards = { ...state.cards }
          for (const id of col.cardIds) {
            delete newCards[id]
          }
          return {
            columns: state.columns.filter((c) => c.id !== columnId),
            cards: newCards,
          }
        }),
      reorderColumns: (activeId, overId) =>
        set((state) => {
          const from = state.columns.findIndex((c) => c.id === activeId)
          const to = state.columns.findIndex((c) => c.id === overId)
          if (from < 0 || to < 0 || from === to) return {}
          const next = [...state.columns]
          const [moved] = next.splice(from, 1)
          next.splice(to, 0, moved)
          return { columns: next }
        }),
      addCard: (columnId, title, description) => {
        const id = uid("card")
        const now = Date.now()
        set((state) => {
          const card: Card = { id, title, description, createdAt: now }
          const cols = state.columns.map((c) =>
            c.id === columnId ? { ...c, cardIds: [...c.cardIds, id] } : c
          )
          return { columns: cols, cards: { ...state.cards, [id]: card } }
        })
        return id
      },
      updateCard: (cardId, updates) =>
        set((state) => ({
          cards: {
            ...state.cards,
            [cardId]: { ...state.cards[cardId], ...updates, updatedAt: Date.now() },
          },
        })),
      deleteCard: (columnId, cardId) =>
        set((state) => {
          const col = state.columns.find((c) => c.id === columnId)
          if (!col) return {}
          return {
            columns: state.columns.map((c) =>
              c.id === columnId ? { ...c, cardIds: c.cardIds.filter((id) => id !== cardId) } : c
            ),
            cards: Object.fromEntries(Object.entries(state.cards).filter(([id]) => id !== cardId)),
          }
        }),
      moveCard: (cardId, fromColumnId, toColumnId, toIndex) =>
        set((state) => {
          if (fromColumnId === toColumnId) {
            // move within same column
            const col = state.columns.find((c) => c.id === fromColumnId)
            if (!col) return {}
            const currentIndex = col.cardIds.indexOf(cardId)
            if (currentIndex < 0 || currentIndex === toIndex) return {}
            const nextIds = [...col.cardIds]
            nextIds.splice(currentIndex, 1)
            nextIds.splice(toIndex, 0, cardId)
            return {
              columns: state.columns.map((c) => (c.id === col.id ? { ...c, cardIds: nextIds } : c)),
            }
          }
          // cross-column
          const fromCol = state.columns.find((c) => c.id === fromColumnId)
          const toCol = state.columns.find((c) => c.id === toColumnId)
          if (!fromCol || !toCol) return {}
          const fromIds = fromCol.cardIds.filter((id) => id !== cardId)
          const toIds = [...toCol.cardIds]
          const boundedIndex = Math.max(0, Math.min(toIndex, toIds.length))
          toIds.splice(boundedIndex, 0, cardId)
          return {
            columns: state.columns.map((c) => {
              if (c.id === fromCol.id) return { ...c, cardIds: fromIds }
              if (c.id === toCol.id) return { ...c, cardIds: toIds }
              return c
            }),
          }
        }),
      reorderCardInColumn: (columnId, activeId, overId) =>
        set((state) => {
          const col = state.columns.find((c) => c.id === columnId)
          if (!col) return {}
          const from = col.cardIds.indexOf(activeId)
          const to = col.cardIds.indexOf(overId)
          if (from < 0 || to < 0 || from === to) return {}
          const next = [...col.cardIds]
          const [moved] = next.splice(from, 1)
          next.splice(to, 0, moved)
          return {
            columns: state.columns.map((c) => (c.id === columnId ? { ...c, cardIds: next } : c)),
          }
        }),
      reset: () => set(() => seed()),
    }),
    {
      name: "kanban-board-v1",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
)
