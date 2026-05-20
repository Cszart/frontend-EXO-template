# Template Improvement Guide

Reference for all identified improvements. Organized by priority so each session can pick up where the last one left off.

Items marked with a checkbox `[ ]` are pending. Mark them `[x]` when done.

---

## P0 — Brand Centralization

These are the "copy-paste template" blockers. A new client project should only need to change one config file.

### [ ] Create brand config file

**Problem:** Brand values (company name, logo, rights year, default avatar) are scattered and hardcoded across components.

**Solution:** Create `const/brand.ts`:

```ts
export const brand = {
  name: 'Shokworks',           // Company name shown in footer, sidebar, title
  rightsYear: '2023',          // Copyright year in footer
  logo: '/icons/svg/logo.svg', // Sidebar/desktop + mobile header logo
  defaultAvatar: '/icons/svg/avatar.svg',
  defaultOgImage: '/icons/svg/og-image.png',
};
```

Then replace every hardcoded reference with an import from this file.

### [ ] Hardcoded base64 logo in layout

**File:** `components/layout/layout/layout.tsx` (line ~75)

Currently embeds a full base64-encoded SVG as the sidebar logo. Should use `brand.logo` with Next.js `<Image>` or `<img>`.

### [ ] Hardcoded company name and rights year

**File:** `components/layout/layout/layout.tsx` (lines ~166-167)

```tsx
companyName="Shokworks"
rightsYear="2023"
```

Should read from `brand.name` and `brand.rightsYear`.

### [ ] External Pinterest URL as default user image

**Files:**
- `components/screens/settings/user.tsx`
- `components/screens/auth/signup.tsx`

```ts
image: 'https://i.pinimg.com/736x/3f/94/70/3f9470b34a8e3f526dbdb022f9f19cf7.jpg'
```

Replace with `brand.defaultAvatar` or a local placeholder image in `public/`.

### [ ] PaginationBar uses off-theme colors

**File:** `components/common/paginationBar/paginationBar.tsx`

Uses `bg-indigo-100`, `text-blue-500`, `bg-stone-100` — none of these match the theme defined in `global-tailwind.css`. Should use `bg-blue` / `text-blue` or the CSS custom properties.

### [ ] Mobile sidebar uses undefined CSS classes

**File:** `components/layout/sidebars/mobile.tsx`

References classes that don't exist: `bg-secondary-default`, `text-secondary-disable`, `bg-secondary-hover`. These need to be either defined in the theme or replaced with valid Tailwind classes.

---

## P1 — Component Quality

### [ ] Theme bypass — components hardcode colors instead of using CSS custom properties

`styles/global-tailwind.css` defines:
```css
--color-primary: #212529;
--color-blue: #4dacd4;
--color-alert-success: #37a211;
--color-alert-error: #b52423;
```

But most components use raw Tailwind colors (`text-gray-800`, `text-blue-500`, `bg-indigo-100`, etc.) instead of the theme tokens. A theme change in `global-tailwind.css` has no effect.

**Scope:** Typography, PaginationBar, Tables, Dropdown, EmptyState, Spinner, and most screen components.

### [ ] Mutation bug in `utils/options.ts`

**File:** `utils/options.ts` — `filterNavigationOptionsByRolesOrPermissions`

The function mutates `option.subOptions` in-place via `.filter()`, which modifies the original navigation config array. Should create new objects:

```ts
// Bad — mutates the original
option.subOptions = option.subOptions.filter(...)

// Good — returns new object
return { ...option, subOptions: option.subOptions.filter(...) }
```

### [ ] PaginatedTable has hardcoded total pages

**File:** `components/common/tables/paginatedTable.tsx` (line ~58)

`totalPages={100}` is hardcoded, making pagination non-functional for real data. Should compute from `rows.length / pageSize` or accept it as a prop.

### [ ] Typography component — 300-line if/else chain

**File:** `components/common/typography/typography.tsx`

Uses a massive if/else chain to map `type` prop to className. Should use a variant map:

```ts
const variantMap: Record<string, string> = {
  'headline-2': 'text-4xl font-bold',
  'headline-3': 'text-3xl font-bold',
  // ...
};
```

Also hardcodes `text-gray-800` in every branch instead of using the theme's primary color.

### [ ] EmptyState component has hardcoded image path

**File:** `components/common/emptyState/emptyState.tsx`

Inlined `/icons/svg/no_data.svg` — should come from brand config or at least be a named constant.

### [ ] Logger extends React.Component unnecessarily

**File:** `utils/logger.ts`

```ts
export default class Logger extends React.Component<{}, {}> {
```

Logger is a utility, not a UI component. Should be a plain class:

```ts
export default class Logger {
  constructor(private options: { identifier: string }) {}
  info(...) { ... }
  error(...) { ... }
}
```

### [ ] Test data in navigation config

**File:** `const/header.ts`

`headerNavbarOptions` contains demo entries ("Home", "About", "Section", "Click") that trigger `toast()` on click. These are fine for development but should be documented as placeholders or moved to a demo-only section.

---

## P2 — Cleanup & Polish

### [ ] Console.log / console.error in production code

Several screen components have `console.log` or `console.error` calls that should go through `Logger` or be removed:

- `components/screens/settings/user.tsx`
- `components/screens/settings/roles.tsx`
- `components/screens/settings/permissions.tsx`
- `components/screens/email/contentEditor.tsx`

### [ ] Loose `any` types

Several interfaces and function signatures use `any`:

- `interfaces/components/option.ts` — `onClick?: ((instance: any) => void) | (() => void)`
- Various table column `content` renderers

Should use generics or at minimum `unknown`.

### [ ] Favicon and meta defaults

The template ships with default Next.js favicon and meta tags. A brand config should also cover:
- `public/favicon.ico`
- `pages/_document.tsx` — `<Head>` meta tags (title, description, OG image)
- `public/icons/svg/og-image.png`

### [ ] Screen component patterns

Screen components (in `components/screens/`) mix data fetching, state management, and rendering in single files. For the template's purpose this is acceptable, but documenting the intended pattern (fetch in `getServerSideProps`, pass as props) would help users.

---

## Already Completed (2026)

These changes are done and documented separately:

- [x] Auth refactor — 3-layer system (`requireAuth`, `AuthGuard`, `Can`) → `docs/updates-2026/auth.md`
- [x] Icon simplification — removed `Icon` component, using Heroicons directly → `docs/updates-2026/icons-and-toast.md`
- [x] Toast notifications — replaced all 22 `alert()` calls with Sonner → `docs/updates-2026/icons-and-toast.md`
- [x] Package updates — all dependencies updated to latest
- [x] react-inlinesvg removed
- [x] const/icons.ts enum removed

---

## File Reference

Quick lookup for files mentioned in this guide:

| File | Purpose |
|------|---------|
| `const/brand.ts` | (to create) Central brand config |
| `const/header.ts` | Navbar options |
| `const/sideBarNavigation.tsx` | Sidebar nav items with icons |
| `styles/global-tailwind.css` | Theme CSS custom properties |
| `components/layout/layout/layout.tsx` | Main layout with hardcoded brand |
| `components/layout/sidebars/desktop.tsx` | Desktop sidebar |
| `components/layout/sidebars/mobile.tsx` | Mobile sidebar (broken classes) |
| `components/common/typography/typography.tsx` | Typography variant component |
| `components/common/paginationBar/paginationBar.tsx` | Pagination with off-theme colors |
| `components/common/tables/paginatedTable.tsx` | Table with hardcoded totalPages |
| `components/common/emptyState/emptyState.tsx` | Empty state with hardcoded image |
| `components/common/avatar/avatar.tsx` | Avatar with hardcoded default |
| `components/screens/settings/user.tsx` | User settings (Pinterest URL) |
| `components/screens/auth/signup.tsx` | Sign up (Pinterest URL) |
| `utils/options.ts` | Navigation filter (mutation bug) |
| `utils/logger.ts` | Logger (extends React.Component) |
| `pages/_app.tsx` | App entry with Toaster |
| `pages/_document.tsx` | HTML head / meta tags |
