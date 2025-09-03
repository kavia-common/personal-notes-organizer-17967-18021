<template>
  <footer class="footer">
    <div class="foot-inner">
      <span>© {{ year }} Notes</span>
      <span class="dot">•</span>
      <span class="muted">Light, minimal, modern</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  border-top: 1px solid var(--c-border);
  background: var(--c-surface);
}
.foot-inner {
  margin-left: auto;
  color: var(--c-text-muted);
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
}
.dot { color: var(--c-border); }
.muted { color: var(--c-text-muted); }
</style>
