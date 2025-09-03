<template>
  <div class="editor">
    <div class="toolbar">
      <input class="input" v-model="local.title" placeholder="Note title" aria-label="Note title" />
      <div class="toolbar-actions">
        <button class="btn" title="Move to folder" @click="promptFolder">Move</button>
        <button class="btn" title="Add tag" @click="promptTag">Tag</button>
        <button class="btn btn-primary" @click="save">Save</button>
        <button class="btn btn-danger" v-if="!isNew" @click="$emit('delete', local.id)">Delete</button>
      </div>
    </div>

    <div class="meta">
      <div class="field">
        <label>Folder</label>
        <span class="value">{{ local.folder || 'None' }}</span>
      </div>
      <div class="field">
        <label>Tags</label>
        <div class="tags">
          <span v-if="!local.tags.length" class="muted">No tags</span>
          <span v-for="t in local.tags" :key="t" class="badge">#{{ t }}</span>
        </div>
      </div>
    </div>

    <textarea
      class="content"
      v-model="local.content"
      placeholder="Start typing your note..."
      rows="16"
      aria-label="Note content"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import type { Note } from '~/types'

const props = defineProps<{
  note: Note
  isNew?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', note: Note): void
  (e: 'delete', id: string): void
}>()

const local = reactive<Note>({ ...props.note })

watch(() => props.note, (n) => {
  Object.assign(local, n)
})

function save() {
  emit('save', {
    ...local,
    updatedAt: Date.now(),
  })
}

function promptFolder() {
  const v = prompt('Move to folder (leave empty for none):', local.folder || '')
  if (v !== null) {
    local.folder = v.trim() || ''
  }
}

function promptTag() {
  const v = prompt('Add a tag (single word, no #):')
  if (!v) return
  const tag = v.trim().replace(/^#/, '')
  if (tag && !local.tags.includes(tag)) local.tags.push(tag)
}

const isNew = computed(() => !!props.isNew)
</script>

<style scoped>
.editor {
  display: grid;
  gap: 0.75rem;
}

.toolbar {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  align-items: center;
}
.toolbar-actions {
  display: inline-flex;
  gap: 0.5rem;
}

.meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--c-surface-2);
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
}

.field {
  display: grid;
  gap: 0.25rem;
}
.field label {
  color: var(--c-text-muted);
  font-size: 0.85rem;
}
.value {
  font-weight: 600;
}

.content {
  width: 100%;
  min-height: 40vh;
  padding: 0.9rem 1rem;
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  outline: none;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  line-height: 1.6;
  resize: vertical;
}
.content:focus {
  border-color: var(--c-primary);
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.12);
}
</style>
