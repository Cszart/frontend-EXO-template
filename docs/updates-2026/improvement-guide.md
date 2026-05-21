# Template Improvement Guide

Reference for all identified improvements. Organized by priority so each session can pick up where the last one left off.

Items marked with a checkbox `[ ]` are pending. Mark them `[x]` when done.

---

## P0 — Brand Centralization

These are the "copy-paste template" blockers. A new client project should only need to change one config file.

### [x] Create brand config file — done (`const/brand.ts` created)

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

### [x] Hardcoded base64 logo in layout — done (replaced with `brand.logo`)

**File:** `components/layout/layout/layout.tsx` (line ~75)

Previously embedded a full base64-encoded SVG as the sidebar logo. Now uses `brand.logo` with Next.js `<Image>` or `<img>`.

### [x] Hardcoded company name and rights year — done (reads from brand config)

**File:** `components/layout/layout/layout.tsx` (lines ~166-167)

Previously hardcoded `companyName="Shokworks"` and `rightsYear="2023"`. Now reads from `brand.name` and `brand.rightsYear`.

### [x] External Pinterest URL as default user image — done (uses `brand.defaultAvatar`)

**Files:**
- `components/screens/settings/user.tsx`
- `components/screens/auth/signup.tsx`

Previously used `https://i.pinimg.com/736x/...` as default avatar. Now uses `brand.defaultAvatar`.

### [x] PaginationBar uses off-theme colors — done (now uses `bg-blue`, `bg-dark-10`, `text-dark-80`)

**File:** `components/common/paginationBar/paginationBar.tsx`

Previously used `bg-indigo-100`, `text-blue-500`, `bg-stone-100`. Now uses theme-aligned classes.

### [x] Mobile sidebar uses undefined CSS classes — done (now uses `bg-dark-100`, `text-dark-30`, `hover:bg-dark-80`)

**File:** `components/layout/sidebars/mobile.tsx`

Previously referenced undefined classes (`bg-secondary-default`, `text-secondary-disable`, `bg-secondary-hover`). Now uses valid theme classes.

---

## P1 — Component Quality

### [x] Theme bypass — Typography now uses `text-primary` — done

`styles/global-tailwind.css` defines:
```css
--color-primary: #212529;
--color-blue: #4dacd4;
--color-alert-success: #37a211;
--color-alert-error: #b52423;
```

But most components use raw Tailwind colors (`text-gray-800`, `text-blue-500`, `bg-indigo-100`, etc.) instead of the theme tokens. A theme change in `global-tailwind.css` has no effect.

**Scope:** Typography, PaginationBar, Tables, Dropdown, EmptyState, Spinner, and most screen components.

### [x] Mutation bug in `utils/options.ts` — done (uses `.reduce()` now)

**File:** `utils/options.ts` — `filterNavigationOptionsByRolesOrPermissions`

Previously mutated `option.subOptions` in-place via `.filter()`. Now uses `.reduce()` to build new objects without mutation.

### [x] PaginatedTable has hardcoded total pages — done (computes dynamically or accepts prop)

**File:** `components/common/tables/paginatedTable.tsx` (line ~58)

Previously had `totalPages={100}` hardcoded. Now computes from `rows.length / pageSize` or accepts it as a prop.

### [x] Typography component — 300-line if/else chain — done (variant map lookup)

**File:** `components/common/typography/typography.tsx`

Previously used a massive if/else chain to map `type` prop to className. Now uses a variant map lookup. Also uses `text-primary` instead of hardcoded `text-gray-800`.

### [x] EmptyState component has hardcoded image path — done (uses `brand.emptyStateImage`)

**File:** `components/common/emptyState/emptyState.tsx`

Previously inlined `/icons/svg/no_data.svg`. Now reads from `brand.emptyStateImage`.

### [x] Logger extends React.Component unnecessarily — done (plain class now)

**File:** `utils/logger.ts`

Previously extended `React.Component<{}, {}>`. Now a plain utility class with no React dependency.

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
- [x] Brand config centralization → `const/brand.ts`
- [x] Logger converted to plain class
- [x] Typography refactored to variant map with theme tokens
- [x] Navigation filter mutation bug fixed
- [x] PaginationBar theme colors fixed
- [x] PaginatedTable dynamic totalPages
- [x] Mobile sidebar CSS classes fixed
- [x] Layout base64 logo replaced with brand config
- [x] Avatar/EmptyState wired to brand config
- [x] Pinterest URLs replaced with brand.defaultAvatar

---

## File Reference

Quick lookup for files mentioned in this guide:

| File | Purpose |
|------|---------|
| `const/brand.ts` | Central brand config |
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
