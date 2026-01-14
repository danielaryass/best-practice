# Folder Structure Guide

## Overview
This project follows a feature-based architecture for scalability and maintainability.

```
my-app/
├── app/                          # Next.js app directory (routing)
│   ├── (auth)/                   # Auth route group (shared layout)
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # Dashboard route group (shared layout)
│   │   ├── users/
│   │   ├── settings/
│   │   └── layout.tsx
│   ├── api/                      # API routes
│   ├── layout.tsx                # Root layout
│   ├── providers.tsx             # Client-side providers
│   └── globals.css
│
├── features/                     # Feature modules (domain-driven)
│   ├── users/
│   │   ├── components/           # Feature-specific components
│   │   ├── hooks/                # Feature-specific hooks
│   │   ├── schemas/              # Zod schemas for validation
│   │   ├── services/             # API calls & business logic
│   │   ├── types.ts              # Feature-specific types
│   │   └── index.ts              # Public API exports
│   └── products/
│       └── ...
│
├── components/                   # Shared components
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── ...
│   └── shared/                   # Custom shared components
│       ├── data-table.tsx
│       ├── page-header.tsx
│       └── ...
│
├── lib/                          # Utility libraries
│   ├── api/                      # API client setup
│   │   ├── client.ts
│   │   └── query-keys.ts
│   ├── utils/                    # Utility functions
│   │   └── format.ts
│   └── utils.ts                  # cn() and other helpers
│
├── hooks/                        # Global custom hooks
│   ├── use-toast.ts
│   └── use-media-query.ts
│
├── types/                        # Global TypeScript types
│   ├── api.ts
│   └── common.ts
│
├── config/                       # Configuration files
│   ├── site.ts
│   └── constants.ts
│
└── public/                       # Static assets
```

## Key Principles

### 1. Feature-Based Architecture
- Each feature is self-contained in `features/`
- Features export a public API via `index.ts`
- Internal feature structure: components, hooks, schemas, services, types

### 2. Route Groups
- Use `(name)` for shared layouts without affecting URL
- Example: `(auth)` for login/register with auth layout
- Example: `(dashboard)` for app pages with sidebar layout

### 3. Component Organization
- `components/ui/` - shadcn components (auto-generated)
- `components/shared/` - Reusable custom components
- `features/*/components/` - Feature-specific components

### 4. Separation of Concerns
- **Pages** (`app/`) - Routing and page composition only
- **Features** - Business logic and domain-specific code
- **Components** - Reusable UI elements
- **Lib** - Utilities and configurations

## Best Practices

1. **Colocation**: Keep related code close (components, hooks, tests)
2. **Public API**: Use index.ts to control what's exported from features
3. **Type Safety**: Define schemas with Zod, derive TypeScript types
4. **Query Keys**: Centralize TanStack Query keys in `lib/api/query-keys.ts`
5. **Atomic Commits**: Each feature change should be self-contained
