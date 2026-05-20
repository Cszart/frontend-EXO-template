# Icons & Toast

## Icons — Heroicons

The template uses `@heroicons/react` directly for all UI icons. There is no custom `Icon` wrapper component — just import and render.

```tsx
import { HomeIcon, Cog6ToothIcon } from '@heroicons/react/20/solid';

<HomeIcon className="w-4 h-4 text-white" />
```

### Where icons are used

- **Sidebar navigation** (`const/sideBarNavigation.tsx`) — each nav item has an `icon` prop that accepts `ReactNode`
- **Buttons** — `icon` prop accepts `ReactNode`, positioned with `iconLeft` / `iconRight` booleans
- **Inputs** — `iconLeft` / `iconRight` props accept `ReactNode`
- **Dropdown items** — `icon` prop accepts `ReactNode`
- **Table row actions** — `icon` prop accepts `ReactNode`

### Brand logos

Brand logos (Google, Facebook, Coinbase, etc.) are not UI icons — they're static images stored in `public/icons/svg/`. Use them with `<img>` or Next.js `<Image>` directly:

```tsx
<img src="/icons/svg/google.svg" alt="Google" className="w-6 h-6" />
```

### What changed in 2026

- **Removed** the `Icon` component (38 fill props + SCSS module) — over-engineered for actual usage
- **Removed** `react-inlinesvg` dependency
- **Removed** `const/icons.ts` enum
- **Changed** icon props from `string` (SVG path) to `ReactNode` across Button, Input, Dropdown, and Option interfaces

---

## Toast Notifications — Sonner

The template uses [Sonner](https://sonner.emilkowal.dev/) for toast notifications. The `<Toaster>` is mounted in `_app.tsx`.

```tsx
import { toast } from 'sonner';

toast.success('User created');
toast.error('Something went wrong');
toast('Simple message');
```

### Configuration

`<Toaster richColors position="top-right" />` in `_app.tsx`. Sonner auto-dismisses toasts and supports stacking.

### What changed in 2026

- **Added** `sonner` package
- **Replaced** all 22 `alert()` calls with `toast.success()`, `toast.error()`, or `toast()`
- Zero `alert()` calls remain in the codebase
