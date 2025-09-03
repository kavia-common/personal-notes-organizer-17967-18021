<template>
  <div class="app-shell">
    <AppHeader
      :search="search"
      @update:search="onSearchUpdate"
      @new-note="onNewNote"
      @toggle-sidebar="sidebarOpen = !sidebarOpen"
    />

    <div class="app-body">
      <aside
        class="sidebar"
        :class="{ 'sidebar--open': sidebarOpen }"
        @keydown.esc="sidebarOpen = false"
      >
        <Sidebar
          :tags="allTags"
          :folders="allFolders"
          :activeTag="activeTag"
          :activeFolder="activeFolder"
          @selectTag="onSelectTag"
          @selectFolder="onSelectFolder"
          @clearFilters="onClearFilters"
        />
      </aside>

      <main class="main-panel">
        <slot />
      </main>
    </div>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppHeader from '~/components/AppHeader.vue'
import AppFooter from '~/components/AppFooter.vue'
import Sidebar from '~/components/Sidebar.vue'
import { useNotesStore } from '~/composables/useNotesStore'

const sidebarOpen = ref(false)
const search = ref('')

const store = useNotesStore()

// Filters controlled by sidebar
const activeTag = ref<string | null>(null)
const activeFolder = ref<string | null>(null)

const allTags = computed(() => store.getAllTags())
const allFolders = computed(() => store.getAllFolders())

function onSelectTag(tag: string) {
  activeTag.value = tag
  activeFolder.value = null
}
function onSelectFolder(folder: string) {
  activeFolder.value = folder
  activeTag.value = null
}
function onClearFilters() {
  activeTag.value = null
  activeFolder.value = null
}
function onSearchUpdate(val: string) {
  search.value = val
}
function onNewNote() {
  // Emit a custom event so pages can react (Home page listens)
  window.dispatchEvent(new CustomEvent('app:new-note'))
}

// Persist filters in URL so refresh keeps context (optional but useful)
watch([activeTag, activeFolder, search], () => {
  const q: Record<string, string> = {}
  if (activeTag.value) q.tag = activeTag.value
  if (activeFolder.value) q.folder = activeFolder.value
  if (search.value) q.q = search.value
  navigateTo({ query: q }, { replace: true })
})
</script>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  background: var(--c-surface);
  color: var(--c-text);
}

.app-body {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 0;
  flex: 1;
  min-height: 0;
  border-top: 1px solid var(--c-border);
  border-bottom: 1px solid var(--c-border);
}

.sidebar {
  background: var(--c-surface-2);
  border-right: 1px solid var(--c-border);
  overflow: auto;
}

.main-panel {
  overflow: auto;
  min-height: 0;
  padding: 1rem;
}

@media (max-width: 920px) {
  .app-body {
    grid-template-columns: 1fr;
  }
  .sidebar {
    position: fixed;
    inset: 56px auto 56px 0;
    width: 80%;
    max-width: 320px;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    z-index: 40;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    border-right: 1px solid var(--c-border);
  }
  .sidebar.sidebar--open {
    transform: translateX(0);
  }
  .main-panel {
    padding: 0.75rem;
  }
}
</style>
