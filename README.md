# My App - Scalable Next.js Architecture

A production-ready Next.js application with best practices for scalability and maintainability.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI components
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **TanStack Query** - Server state management

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
my-app/
├── app/                    # Next.js app directory (routing)
│   ├── (auth)/            # Auth routes (login, register)
│   ├── (dashboard)/       # Protected app routes
│   ├── providers.tsx      # Client providers (TanStack Query)
│   └── layout.tsx         # Root layout
│
├── features/              # Feature modules
│   └── users/             # User management feature
│       ├── components/    # Feature UI components
│       ├── hooks/         # TanStack Query hooks
│       ├── schemas/       # Zod validation schemas
│       ├── services/      # API calls
│       ├── types.ts       # TypeScript types
│       └── index.ts       # Public API
│
├── components/            # Shared components
│   ├── ui/               # shadcn/ui components
│   └── shared/           # Custom reusable components
│
├── lib/                  # Utilities
│   ├── api/             # API client & query keys
│   └── utils.ts         # Helper functions
│
├── hooks/               # Global custom hooks
├── types/               # Global TypeScript types
└── config/              # Configuration files
```

## Architecture Principles

### 1. Feature-Based Organization
Each feature is self-contained with its own:
- Components
- Hooks (TanStack Query)
- Services (API calls)
- Schemas (Zod validation)
- Types
- Public API (`index.ts`)

### 2. Separation of Concerns
- **Pages** - Routing and composition only
- **Features** - Business logic and domain code
- **Components** - Reusable UI elements
- **Services** - API communication
- **Hooks** - Data fetching and mutations

### 3. Type Safety
- Zod schemas define runtime validation
- TypeScript types derived from schemas using `z.infer`
- Centralized type definitions

### 4. State Management
- **Server State** - TanStack Query
- **Form State** - React Hook Form
- **UI State** - React useState/useReducer

## Example: Users Feature

### File Structure
```
features/users/
├── components/
│   ├── create-user-form.tsx    # Form with validation
│   └── user-list.tsx            # List with pagination
├── hooks/
│   └── use-users.ts             # TanStack Query hooks
├── schemas/
│   └── user.schema.ts           # Zod schemas
├── services/
│   └── user.service.ts          # API calls
├── types.ts                     # TypeScript types
└── index.ts                     # Public exports
```

### Usage in Pages

```tsx
// app/(dashboard)/users/page.tsx
import { CreateUserForm, UserList } from '@/features/users'

export default function UsersPage() {
  return (
    <div>
      <CreateUserForm />
      <UserList />
    </div>
  )
}
```

## Adding New Features

1. Create feature directory: `features/your-feature/`
2. Add subdirectories: `components/`, `hooks/`, `schemas/`, `services/`
3. Define Zod schemas for validation
4. Create service functions for API calls
5. Create TanStack Query hooks
6. Build UI components
7. Export public API via `index.ts`
8. Add query keys to `lib/api/query-keys.ts`

## Form Handling Example

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { yourSchema } from './schemas/your.schema'

function YourForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(yourSchema)
  })

  const onSubmit = (data) => {
    // data is fully typed and validated
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('field')} />
      {errors.field && <span>{errors.field.message}</span>}
    </form>
  )
}
```

## TanStack Query Example

```tsx
import { useQuery, useMutation } from '@tanstack/react-query'

function Component() {
  // Fetch data
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers()
  })

  // Mutate data
  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}
```

## Adding shadcn Components

```bash
npx shadcn@latest add [component-name]
```

## Best Practices

1. **Colocation** - Keep related files together
2. **Single Responsibility** - One component, one purpose
3. **Type Safety** - Use Zod schemas + TypeScript
4. **Error Handling** - Handle loading, error, and empty states
5. **Reusability** - Extract common patterns
6. **Testing** - Write tests alongside components
7. **Performance** - Use React.memo, useMemo when needed

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query](https://tanstack.com/query)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
- [shadcn/ui](https://ui.shadcn.com)
