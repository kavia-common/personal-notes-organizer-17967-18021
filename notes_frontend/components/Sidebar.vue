<template>
  <div class="sidebar-wrap">
    <div class="section">
      <div class="section-title">Folders</div>
      <ul class="list">
        <li>
          <button
            class="list-item"
            :class="{ active: activeFolder === 'All' }"
            @click="$emit('selectFolder', 'All')"
          >
            <span class="dot dot-all"></span>
            All
          </button>
        </li>
        <li v-for="f in folders" :key="f">
          <button
            class="list-item"
            :class="{ active: activeFolder === f }"
            @click="$emit('selectFolder', f)"
          >
            <span class="dot"></span>
            {{ f }}
          </button>
        </li>
      </ul>
    </div>

    <div class="section">
      <div class="section-title">Tags</div>
      <div class="tags">
        <button
          v-for="t in tags"
          :key="t"
          class="badge tag"
          :class="{ active: activeTag === t }"
          @click="$emit('selectTag', t)"
        >
          #{{ t }}
        </button>
      </div>
    </div>

    <div class="section">
      <button class="btn btn-ghost" @click="$emit('clearFilters')">
        Clear filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tags: string[]
  folders: string[]
  activeTag: string | null
  activeFolder: string | null
}>()
defineEmits<{
  (e: 'selectTag', tag: string): void
  (e: 'selectFolder', folder: string): void
  (e: 'clearFilters'): void
}>()
</script>

<style scoped>
.sidebar-wrap {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.section {
  display: grid;
  gap: 0.5rem;
}
.section-title {
  font-weight: 600;
  color: var(--c-text-muted);
  font-size: 0.85rem;
  letter-spacing: .02em;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.35rem;
}
.list-item {
  width: 100%;
  text-align: left;
  padding: 0.5rem 0.6rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--c-text);
}
.list-item:hover {
  background: #fff;
  box-shadow: var(--shadow-1);
  border: 1px solid var(--c-border);
}
.list-item.active {
  background: var(--c-primary);
  color: #fff;
  border: 1px solid var(--c-primary);
  box-shadow: var(--shadow-2);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}
.tag {
  cursor: pointer;
}
.tag.active {
  background: var(--c-secondary);
  border-color: var(--c-secondary);
  color: #fff;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--c-secondary);
  display: inline-block;
}
.dot-all {
  background: var(--c-accent);
}
</style>
