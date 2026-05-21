# EXO Frontend Template

A production-ready Next.js template for bootstrapping new client projects. Pre-configured with auth, RBAC, email editor, and common UI components so you can skip the boilerplate and start building features.

**Demo:** https://frontend-exo-template.vercel.app/

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (Pages Router) |
| UI | React 19, Tailwind CSS v4 |
| Auth | NextAuth v4 (credentials, Google, Facebook, wallet) |
| Web3 | wagmi v3, viem v2 |
| Forms | react-hook-form |
| Icons | @heroicons/react |
| Toasts | Sonner |
| Editor | Lexical |
| Testing | Cypress |

## Quick Start

### Automatic (recommended)

```bash
npx create-exo-frontend-template <project-name>
cd <project-name>
```

This clones the template and sets up `.env` for you.

### Manual

```bash
git clone https://github.com/Cszart/frontend-EXO-template
cd frontend-EXO-template
npm install
cp .env.example .env   # fill in your values
npm run dev
```

Open http://localhost:3000.

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Purpose |
|----------|---------|
| `NEXTAUTH_URL` | Base URL (default: `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Secret for JWT signing |
| `NEXT_PUBLIC_API` | Backend API base URL |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `NEXT_PUBLIC_GOOGLE_CLIENT_SECRET` | Google OAuth secret |
| `NEXT_PUBLIC_FACEBOOK_CLIENT_ID` | Facebook OAuth app ID |
| `NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET` | Facebook OAuth secret |

## Branding a New Project

To customize for a new client, edit **one file**:

```ts
// const/brand.ts
export const brand = {
  name: 'ClientName',
  rightsYear: '2026',
  logo: '/icons/svg/logo.svg',
  defaultAvatar: '/icons/svg/avatar.svg',
  emptyStateImage: '/icons/svg/no_data.svg',
};
```

Then:

1. Replace `public/icons/svg/logo.svg` with the client's logo
2. Replace `public/favicon.ico` with the client's favicon
3. Update the theme colors in `styles/global-tailwind.css`:
   ```css
   @theme {
     --color-primary: #yourColor;
     --color-blue: #yourColor;
     /* etc. */
   }
   ```

## Project Structure

```
components/
  auth/           requireAuth, AuthGuard, Can (3-layer auth)
  common/         Typography, Button, Avatar, Spinner, EmptyState, Tabs, Separator
  common/dropdown Dropdown menu
  common/tables/  SimpleTable, PaginatedTable
  form/           InputText, InputEmail, InputPassword, InputList
  layout/         Layout, Sidebar (desktop + mobile), Header, Footer
  modals/         Reusable modal components
  screens/        Page-level components (auth, settings, email)
  text-editor/    Lexical-based rich text editor

const/            Configuration files
  brand.ts        Client brand values (name, logo, colors)
  auth.ts         NextAuth provider enum
  header.ts       Navbar options
  sideBarNavigation.tsx  Sidebar nav items
  routes.ts       Route constants
  role.ts         Role enum
  permissions.ts  Permission enum

pages/            Next.js routes
  auth/           Sign in, sign up, forgot/new password
  settings/       User, roles, permissions CRUD
  email/          Content editor, templates

hooks/            Custom React hooks
interfaces/       TypeScript types
utils/            Utility functions (logger, options filter, auth helpers)
api_services/     API service layer
styles/           Tailwind config and global styles
public/           Static assets (icons, SVGs, favicon)
docs/             Documentation
```

## Pre-built Modules

### Authentication & Authorization

Three-layer auth system:

1. **Server-side** — `requireAuth()` in `getServerSideProps` redirects unauthenticated users
2. **Page-level** — `<AuthGuard>` wrapper hides entire pages
3. **Component-level** — `<Can>` wrapper hides individual UI elements by role/permission

Supports credentials, Google, Facebook, and wallet (MetaMask) login.

### User Management

Full CRUD for users, roles, and permissions with role-based access control. Screens at `/settings/user`, `/settings/roles`, `/settings/permissions`.

### Email Template Editor

Lexical-based rich text editor at `/email/contentEditor` for creating and editing HTML email templates. Supports download as HTML file.

## Available Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |

### Testing

```bash
npx cypress open
```

Select E2E testing and a browser to run the test suite.

## Documentation

- [`docs/updates-2026/auth.md`](docs/updates-2026/auth.md) — Auth system architecture
- [`docs/updates-2026/icons-and-toast.md`](docs/updates-2026/icons-and-toast.md) — Icon and toast patterns
- [`docs/updates-2026/improvement-guide.md`](docs/updates-2026/improvement-guide.md) — Change log and improvement tracker

## Authors

- [Cesar Salazar](https://github.com/Cszart)
- [Valentina Contreras](https://github.com/ValentinaSW)

## License

[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
