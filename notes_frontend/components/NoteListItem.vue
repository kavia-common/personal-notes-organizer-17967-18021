<template>
  <button class="row card" :class="{ active }" @click="$emit('open', note.id)">
    <div class="row-head">
      <strong class="title">{{ note.title || 'Untitled' }}</strong>
      <span class="muted">{{ date }}</span>
    </div>
    <div class="row-body">
      <p class="excerpt">{{ excerpt }}</p>
    </div>
    <div class="row-foot">
      <span v-for="t in note.tags" :key="t" class="badge">#{{ t }}</span>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Note } from '~/types'

const props = defineProps<{
  note: Note
  active?: boolean
}>()

const date = computed(() => new Date(props.note.updatedAt || props.note.createdAt).toLocaleString())

const excerpt = computed(() => {
  const text = props.note.content?.replace(/\s+/g, ' ').trim() || ''
  return text.length > 120 ? text.slice(0, 120) + '…' : text
})

defineEmits<{ (e: 'open', id: string): void }>()
</script>

<style scoped>
.row {
  width: 100%;
  text-align: left;
  padding: 0.75rem;
  border-radius: var(--radius);
  transition: transform .15s ease, box-shadow .15s ease;
}
.row:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-2);
}
.row.active {
  outline: 2px solid rgba(79, 70, 229, .35);
}

.row-head {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}
.title {
  font-size: 1rem;
}
.muted {
  color: var(--c-text-muted);
  font-size: 0.85rem;
}
.row-body {
  color: var(--c-text-muted);
}
.row-foot {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}
.excerpt {
  margin: 0.25rem 0 0;
}
</style>
