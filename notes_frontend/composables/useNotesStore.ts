import { ref } from 'vue'
import type { Note } from '~/types'

const STORAGE_KEY = 'notes.app.data.v1'

/**
 * A minimal in-memory store with localStorage persistence for Notes.
 * Provides CRUD operations and helpers for tags/folders and searching.
 */
export function useNotesStore() {
  // Singleton pattern per app instance
  // @ts-ignore attach to global for SSR-safe shared state if needed
  if (process.client && (window as any).__notes_store) return (window as any).__notes_store as ReturnType<typeof useNotesStore>

  const notes = ref<Note[]>(load())

  function persist() {
    if (!process.client) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes.value))
    } catch {
      // ignore quota errors
    }
  }

  function load(): Note[] {
    if (!process.client) return seed()
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seed()
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    } catch { /* noop */ }
    return seed()
  }

  function seed(): Note[] {
    const now = Date.now()
    return [
      {
        id: cryptoRandomId(),
        title: 'Welcome to Notes',
        content: 'Use the New button to create, and the sidebar to filter by folder or tags.',
        tags: ['welcome', 'tips'],
        folder: 'Guides',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: cryptoRandomId(),
        title: 'Your first note',
        content: 'This is a sample note. Click to edit. Try adding tags and moving it to a folder.',
        tags: [],
        folder: '',
        createdAt: now,
        updatedAt: now,
      }
    ]
  }

  // PUBLIC_INTERFACE
  function list(filter?: { q?: string; tag?: string | null; folder?: string | null }): Note[] {
    /** Returns notes filtered by optional search, tag, or folder. */
    const q = (filter?.q || '').toLowerCase().trim()
    const tag = filter?.tag || null
    const folder = filter?.folder || null

    let result = notes.value.slice().sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt))

    if (q) {
      result = result.filter(n =>
        (n.title || '').toLowerCase().includes(q) ||
        (n.content || '').toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    if (tag) result = result.filter(n => n.tags.includes(tag))
    if (folder) {
      result = folder === 'All' ? result : result.filter(n => (n.folder || '') === folder)
    }
    return result
  }

  // PUBLIC_INTERFACE
  function get(id: string): Note | undefined {
    /** Returns a single note by id. */
    return notes.value.find(n => n.id === id)
  }

  // PUBLIC_INTERFACE
  function create(partial?: Partial<Note>): Note {
    /** Creates a new note with default fields, returns it. */
    const now = Date.now()
    const n: Note = {
      id: cryptoRandomId(),
      title: partial?.title || '',
      content: partial?.content || '',
      tags: partial?.tags || [],
      folder: partial?.folder || '',
      createdAt: now,
      updatedAt: now,
    }
    notes.value.unshift(n)
    persist()
    return n
  }

  // PUBLIC_INTERFACE
  function update(note: Note): void {
    /** Updates an existing note by id, merging fields. */
    const idx = notes.value.findIndex(n => n.id === note.id)
    if (idx !== -1) {
      notes.value[idx] = { ...notes.value[idx], ...note, updatedAt: note.updatedAt || Date.now() }
      persist()
    }
  }

  // PUBLIC_INTERFACE
  function remove(id: string): void {
    /** Deletes a note by id. */
    notes.value = notes.value.filter(n => n.id !== id)
    persist()
  }

  // PUBLIC_INTERFACE
  function getAllTags(): string[] {
    /** Returns all unique tags sorted alphabetically. */
    return Array.from(new Set(notes.value.flatMap(n => n.tags))).sort((a, b) => a.localeCompare(b))
  }

  // PUBLIC_INTERFACE
  function getAllFolders(): string[] {
    /** Returns all unique folders (excluding empty) sorted alphabetically. */
    return Array.from(new Set(notes.value.map(n => n.folder).filter(Boolean))).sort((a, b) => a.localeCompare(b))
  }

  const api = { notes, list, get, create, update, remove, getAllTags, getAllFolders }

  if (process.client) {
    // @ts-ignore
    ;(window as any).__notes_store = api
  }

  return api
}

function cryptoRandomId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    // @ts-ignore
    return crypto.randomUUID()
  }
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}
