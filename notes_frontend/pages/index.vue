<template>
  <div class="home-grid">
    <section class="list-pane">
      <div class="list-header">
        <h2 class="heading">Notes</h2>
        <div class="muted">{{ filtered.length }} total</div>
      </div>
      <div class="list-grid">
        <NoteListItem
          v-for="n in filtered"
          :key="n.id"
          :note="n"
          :active="n.id === activeId"
          @open="open"
        />
      </div>
    </section>

    <section class="detail-pane">
      <div v-if="current" class="card detail-card">
        <NoteEditor
          :note="current"
          :isNew="isNew"
          @save="onSave"
          @delete="onDelete"
        />
      </div>
      <div v-else class="card empty">
        <p class="muted">Select a note from the left or create a new one.</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import NoteListItem from '~/components/NoteListItem.vue'
import NoteEditor from '~/components/NoteEditor.vue'
import { useNotesStore } from '~/composables/useNotesStore'
import type { Note } from '~/types'

const store = useNotesStore()

const route = useRoute()

const search = computed(() => (route.query.q as string) || '')
const tag = computed(() => (route.query.tag as string) || null)
const folder = computed(() => (route.query.folder as string) || null)

const filtered = computed(() => store.list({ q: search.value, tag: tag.value, folder: folder.value }))

const activeId = ref<string | null>(null)
const isNew = ref(false)

const current = computed<Note | null>(() => {
  if (!activeId.value) return null
  return store.get(activeId.value) || null
})

function open(id: string) {
  activeId.value = id
  isNew.value = false
}

function onSave(note: Note) {
  if (isNew.value) {
    store.update(note)
    isNew.value = false
  } else {
    store.update(note)
  }
}

function onDelete(id: string) {
  const confirmDelete = confirm('Delete this note? This action cannot be undone.')
  if (!confirmDelete) return
  store.remove(id)
  if (activeId.value === id) {
    activeId.value = null
    isNew.value = false
  }
}

function createNewNote() {
  const n = store.create({ title: 'Untitled', content: '' })
  activeId.value = n.id
  isNew.value = true
}

// Listen to app-level new note event from header button in layout
function onGlobalNew() {
  createNewNote()
}

onMounted(() => {
  window.addEventListener('app:new-note', onGlobalNew as EventListener)
  // If we have at least one note and none selected, select first (sorted by updatedAt)
  if (!activeId.value && filtered.value.length) {
    activeId.value = filtered.value[0].id
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('app:new-note', onGlobalNew as EventListener)
})
</script>

<style scoped>
.home-grid {
  display: grid;
  grid-template-columns: minmax(260px, 420px) 1fr;
  gap: 1rem;
  height: 100%;
}

.list-pane {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 0.5rem;
  min-height: 0;
}
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0.25rem 0.25rem 0.25rem 0;
}
.heading {
  margin: 0;
}
.list-grid {
  display: grid;
  gap: 0.5rem;
  overflow: auto;
  padding-right: 0.25rem;
}

.detail-pane {
  min-height: 0;
}
.detail-card {
  padding: 0.9rem;
}

.empty {
  padding: 2.25rem 1.25rem;
  text-align: center;
}
.muted {
  color: var(--c-text-muted);
}

@media (max-width: 920px) {
  .home-grid {
    grid-template-columns: 1fr;
  }
}
</style>
