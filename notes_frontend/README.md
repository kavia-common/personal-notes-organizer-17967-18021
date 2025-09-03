# Notes Frontend (Nuxt 3)

A modern, minimalistic notes UI with:
- Create, edit, delete, and list notes
- Organize by tags and folders
- Responsive layout with sidebar, header, and footer
- Light theme using brand colors (primary: `#4f46e5`, secondary: `#8b5cf6`, accent: `#f59e42`)
- LocalStorage persistence (no backend required)

## Quick Start

```bash
# install
npm install

# dev
npm run dev

# build
npm run build

# preview
npm run preview
```

## Structure

- layouts/default.vue — app shell with header, sidebar, footer
- pages/index.vue — main notes experience
- components/ — UI building blocks
- composables/useNotesStore.ts — CRUD and persistence

## Notes

- Data is stored in `localStorage` under the key `notes.app.data.v1`.
- You can expand to a backend later by swapping the composable with API calls.
