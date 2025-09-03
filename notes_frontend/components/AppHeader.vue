<template>
  <header class="header">
    <div class="left">
      <button class="btn btn-ghost mobile-only" aria-label="Toggle sidebar" @click="$emit('toggle-sidebar')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
      <div class="brand">
        <span class="brand-mark">✦</span>
        <strong>Notes</strong>
      </div>
    </div>

    <div class="center">
      <input
        :value="search"
        @input="$emit('update:search', ($event.target as HTMLInputElement).value)"
        type="search"
        placeholder="Search notes..."
        class="input search"
        aria-label="Search notes"
      />
    </div>

    <div class="right">
      <button class="btn btn-primary" @click="$emit('new-note')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        New
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  search: string
}>()
defineEmits<{
  (e: 'update:search', val: string): void
  (e: 'new-note'): void
  (e: 'toggle-sidebar'): void
}>()
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 30;
  height: 56px;
  display: grid;
  grid-template-columns: 1fr minmax(180px, 600px) 1fr;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: var(--c-surface);
  border-bottom: 1px solid var(--c-border);
}

.left, .right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.left { justify-self: start; }
.center { justify-self: center; width: 100%; }
.right { justify-self: end; }

.brand {
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
  color: var(--c-text);
}
.brand-mark {
  color: var(--c-accent);
  font-size: 1.1rem;
  line-height: 1;
}

.search {
  max-width: 100%;
}

.mobile-only {
  display: none;
}

@media (max-width: 920px) {
  .header {
    grid-template-columns: auto 1fr auto;
  }
  .mobile-only {
    display: inline-flex;
  }
}
</style>
