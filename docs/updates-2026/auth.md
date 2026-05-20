# Auth Architecture

The frontend uses a 3-layer authorization system. Each layer serves a different purpose and can be used independently.

## Layers

### 1. Server-side guard — `requireAuth()`

**File:** `components/auth/requireAuth.ts`

Pure function called inside `getServerSideProps`. Returns a `Redirect` object if unauthorized, or `undefined` if allowed. Runs before the page renders — no flash of unauthorized content.

```tsx
import { requireAuth } from 'components/auth/requireAuth';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const redirect = requireAuth({
    session,
    allowedRoles: [RolesEnum.ADMIN],
    redirectTo: AppRoutes.HOME,
  });
  if (redirect) return { redirect };
  return { props: {} };
};
```

### 2. Page-level guard — `<AuthGuard>`

**File:** `components/auth/AuthGuard.tsx`

Client-side component that wraps page content. Useful for pages that don't use `getServerSideProps` (static pages, client-only routes). Redirects unauthorized users via `next/router`.

```tsx
<AuthGuard allowedRoles={[RolesEnum.ADMIN]}>
  <AdminPage />
</AuthGuard>
```

### 3. Component-level wrapper — `<Can>`

**File:** `components/auth/Can.tsx`

Conditionally renders children based on the current user's roles/permissions. Use it to hide individual UI elements (buttons, sections) from users who shouldn't see them.

```tsx
<Can allowedPermissions={[PermissionsEnum.USER_MANAGEMENT_DELETE]}>
  <DeleteButton />
</Can>
```

Supports a `fallback` prop for rendering alternative content:

```tsx
<Can allowedRoles={[RolesEnum.ADMIN]} fallback={<ReadOnlyView />}>
  <AdminControls />
</Can>
```

## What changed in 2026

- **Removed** `authUtils` singleton (`utils/auth.ts`) — it required manual session initialization and was error-prone.
- **Removed** HOC wrappers (`withAuthorization`, `withAuthorizationServerSide`, `withAuthorizationComponent`) — they were async, hard to compose, and never worked reliably.
- **Removed** `const/session.ts` — `next-auth/react` already exports session status strings.
- **Added** `requireAuth()` — sync pure function, no class, no global state.
- **Added** `<AuthGuard>` — reads session directly via `useSession()`, no global setup.
- **Added** `<Can>` — same approach, component-level granularity.

All three layers read user roles/permissions directly from `useSession()` or the server-side `getSession()` result. No intermediate state, no initialization step.
