# Developer Onboarding Guide

**Project:** Next.js Scalable Application with RBAC
**Version:** 1.0.0
**Last Updated:** January 2026

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Getting Started](#2-getting-started)
3. [Project Structure](#3-project-structure)
4. [Architecture Overview](#4-architecture-overview)
5. [Technology Stack](#5-technology-stack)
6. [Creating a New Feature](#6-creating-a-new-feature)
7. [Form Handling](#7-form-handling)
8. [Data Fetching](#8-data-fetching)
9. [Authentication & Permissions](#9-authentication--permissions)
10. [Styling Guidelines](#10-styling-guidelines)
11. [Best Practices](#11-best-practices)
12. [Common Patterns](#12-common-patterns)
13. [Testing](#13-testing)
14. [Deployment](#14-deployment)
15. [Troubleshooting](#15-troubleshooting)

---

## 1. Introduction

Welcome to the project! This guide will help you understand the architecture, structure, and patterns used in this Next.js application.

### 1.1 Project Overview

This is a production-ready Next.js 16 application built with:
- **Feature-based architecture** for scalability
- **Role-based access control (RBAC)** for security
- **Type-safe forms** with validation
- **Optimized data fetching** with caching
- **Component-driven design** with shadcn/ui

### 1.2 Key Principles

1. **Feature-Based Organization** - Code is organized by business domain
2. **Separation of Concerns** - Clear boundaries between layers
3. **Type Safety** - Zod schemas + TypeScript everywhere
4. **Colocation** - Keep related code together
5. **DRY (Don't Repeat Yourself)** - Reusable components and utilities

---

## 2. Getting Started

### 2.1 Prerequisites

- Node.js 20+ installed
- npm or yarn package manager
- Basic knowledge of React and TypeScript
- Understanding of Next.js App Router

### 2.2 Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project
cd my-app

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### 2.3 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### 2.4 First Steps

1. Visit `http://localhost:3000/login`
2. Login as "admin" or "user" to test RBAC
3. Explore `/dashboard`, `/users`, `/settings`
4. Review the codebase starting with `features/users`

---

## 3. Project Structure

### 3.1 Directory Overview

```
my-app/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   └── login/
│   ├── (dashboard)/              # Dashboard route group
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── settings/
│   │   └── layout.tsx            # Shared dashboard layout
│   ├── api/                      # API routes
│   ├── layout.tsx                # Root layout
│   ├── providers.tsx             # Client providers
│   └── globals.css               # Global styles
│
├── features/                     # Feature modules
│   ├── auth/                     # Authentication feature
│   │   ├── components/           # Auth-specific components
│   │   ├── context/              # Auth context/provider
│   │   ├── hooks/                # Auth hooks
│   │   └── index.ts              # Public API
│   └── users/                    # User management feature
│       ├── components/           # User UI components
│       ├── hooks/                # TanStack Query hooks
│       ├── schemas/              # Zod validation schemas
│       ├── services/             # API calls
│       ├── types.ts              # TypeScript types
│       └── index.ts              # Public exports
│
├── components/                   # Shared components
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── ...
│   └── shared/                   # Custom shared components
│       ├── page-header.tsx
│       ├── empty-state.tsx
│       └── loading-spinner.tsx
│
├── lib/                          # Utility libraries
│   ├── api/                      # API client setup
│   │   ├── client.ts             # HTTP client
│   │   └── query-keys.ts         # Query key factory
│   ├── permissions/              # RBAC system
│   │   ├── roles.ts              # Role definitions
│   │   └── routes.ts             # Route permissions
│   └── utils.ts                  # Helper functions
│
├── types/                        # Global TypeScript types
│   ├── api.ts                    # API response types
│   └── auth.ts                   # Auth & permission types
│
├── hooks/                        # Global custom hooks
├── config/                       # Configuration files
│   └── site.ts                   # Site configuration
│
├── middleware.ts                 # Next.js middleware
├── components.json               # shadcn/ui config
└── tsconfig.json                 # TypeScript config
```

### 3.2 Route Groups

Route groups use `(name)` syntax for organization without affecting URLs:

```
app/(auth)/login       → /login
app/(dashboard)/users  → /users
```

Benefits:
- Shared layouts
- Logical grouping
- Clean URLs

### 3.3 Feature Module Structure

Each feature follows this structure:

```
features/[feature-name]/
├── components/          # Feature-specific UI
├── hooks/              # Data fetching hooks
├── schemas/            # Zod validation schemas
├── services/           # API communication
├── types.ts            # TypeScript types
└── index.ts            # Public API (exports)
```

**Why?**
- Self-contained
- Easy to understand
- Simple to test
- Clear boundaries

---

## 4. Architecture Overview

### 4.1 Layered Architecture

```
┌─────────────────────────────────────┐
│          Pages (app/)               │  ← Routing & Composition
├─────────────────────────────────────┤
│        Features (features/)         │  ← Business Logic
├─────────────────────────────────────┤
│      Components (components/)       │  ← Reusable UI
├─────────────────────────────────────┤
│      Services (*/services/)         │  ← API Communication
├─────────────────────────────────────┤
│      Utilities (lib/)               │  ← Helpers & Config
└─────────────────────────────────────┘
```

### 4.2 Data Flow

```
User Interaction
      ↓
   Component
      ↓
   Hook (TanStack Query)
      ↓
   Service (API Call)
      ↓
   API Endpoint
      ↓
   Backend/Database
```

### 4.3 State Management

1. **Server State** → TanStack Query
   - API data
   - Caching
   - Background refetching

2. **Form State** → React Hook Form
   - Form inputs
   - Validation
   - Submission

3. **UI State** → React useState/Context
   - Modals
   - Dropdowns
   - Local toggles

4. **Auth State** → Context API
   - User info
   - Permissions
   - Login/logout

---

## 5. Technology Stack

### 5.1 Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.1 | React framework |
| React | 19.2.3 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |

### 5.2 Key Libraries

| Library | Purpose | Documentation |
|---------|---------|---------------|
| shadcn/ui | Component library | [shadcn.com](https://ui.shadcn.com) |
| TanStack Query | Server state | [tanstack.com/query](https://tanstack.com/query) |
| React Hook Form | Form handling | [react-hook-form.com](https://react-hook-form.com) |
| Zod | Schema validation | [zod.dev](https://zod.dev) |

### 5.3 Why These Technologies?

**Next.js 16**
- Server components for performance
- App Router for better DX
- Built-in optimization

**TanStack Query**
- Automatic caching
- Background refetching
- Optimistic updates
- DevTools

**React Hook Form + Zod**
- Type-safe forms
- Minimal re-renders
- Easy validation
- Great DX

**Tailwind CSS**
- Utility-first
- Fast development
- Consistent design
- Small bundle size

---

## 6. Creating a New Feature

### 6.1 Step-by-Step Guide

Let's create a "Products" feature as an example.

#### Step 1: Create Directory Structure

```bash
mkdir -p features/products/{components,hooks,schemas,services}
```

#### Step 2: Define Types

```typescript
// features/products/types.ts
import { z } from 'zod'
import { createProductSchema } from './schemas/product.schema'

export interface Product {
  id: string
  name: string
  price: number
  description: string
  inStock: boolean
  createdAt: string
}

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = Partial<CreateProductInput>
```

#### Step 3: Create Zod Schema

```typescript
// features/products/schemas/product.schema.ts
import { z } from 'zod'

export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name is too long'),
  price: z
    .number()
    .min(0, 'Price must be positive')
    .max(1000000, 'Price is too high'),
  description: z
    .string()
    .min(10, 'Description too short')
    .max(500, 'Description too long'),
  inStock: z.boolean().default(true),
})

export const updateProductSchema = createProductSchema.partial()

export const productFilterSchema = z.object({
  search: z.string().optional(),
  inStock: z.boolean().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
})
```

**Why Zod?**
- Runtime validation
- Type inference
- Error messages
- Schema composition

#### Step 4: Create Service

```typescript
// features/products/services/product.service.ts
import { apiClient } from '@/lib/api/client'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { Product, CreateProductInput, UpdateProductInput } from '../types'

export const productService = {
  // Get all products
  getProducts: async (params?: {
    search?: string
    inStock?: boolean
  }): Promise<PaginatedResponse<Product>> => {
    const queryParams = new URLSearchParams(
      params as Record<string, string>
    ).toString()
    return apiClient.get<PaginatedResponse<Product>>(
      `/products?${queryParams}`
    )
  },

  // Get single product
  getProductById: async (id: string): Promise<ApiResponse<Product>> => {
    return apiClient.get<ApiResponse<Product>>(`/products/${id}`)
  },

  // Create product
  createProduct: async (
    data: CreateProductInput
  ): Promise<ApiResponse<Product>> => {
    return apiClient.post<ApiResponse<Product>>('/products', data)
  },

  // Update product
  updateProduct: async (
    id: string,
    data: UpdateProductInput
  ): Promise<ApiResponse<Product>> => {
    return apiClient.put<ApiResponse<Product>>(`/products/${id}`, data)
  },

  // Delete product
  deleteProduct: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(`/products/${id}`)
  },
}
```

#### Step 5: Create TanStack Query Hooks

```typescript
// features/products/hooks/use-products.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/api/query-keys'
import { productService } from '../services/product.service'
import { CreateProductInput, UpdateProductInput } from '../types'

// Fetch all products
export function useProducts(filters?: { search?: string }) {
  return useQuery({
    queryKey: queryKeys.products.list(JSON.stringify(filters)),
    queryFn: () => productService.getProducts(filters),
  })
}

// Fetch single product
export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: !!id, // Only run if id exists
  })
}

// Create product mutation
export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProductInput) =>
      productService.createProduct(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.lists(),
      })
    },
  })
}

// Update product mutation
export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductInput }) =>
      productService.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(variables.id),
      })
    },
  })
}

// Delete product mutation
export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.lists(),
      })
    },
  })
}
```

#### Step 6: Add Query Keys

```typescript
// lib/api/query-keys.ts
export const queryKeys = {
  // ... existing keys

  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: string) =>
      [...queryKeys.products.lists(), { filters }] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
  },
}
```

**Why Query Keys?**
- Centralized management
- Type safety
- Easy invalidation
- Hierarchical caching

#### Step 7: Create Components

```typescript
// features/products/components/product-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createProductSchema } from '../schemas/product.schema'
import { CreateProductInput } from '../types'
import { useCreateProduct } from '../hooks/use-products'

interface ProductFormProps {
  onSuccess?: () => void
}

export function ProductForm({ onSuccess }: ProductFormProps) {
  const createProduct = useCreateProduct()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      inStock: true,
    },
  })

  const onSubmit = async (data: CreateProductInput) => {
    try {
      await createProduct.mutateAsync(data)
      reset()
      onSuccess?.()
    } catch (error) {
      console.error('Failed to create product:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" {...register('name')} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          {...register('price', { valueAsNumber: true })}
        />
        {errors.price && (
          <p className="text-sm text-red-500">{errors.price.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          {...register('description')}
          className="w-full min-h-[100px] rounded-md border px-3 py-2"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input type="checkbox" id="inStock" {...register('inStock')} />
        <Label htmlFor="inStock">In Stock</Label>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Product'}
      </Button>
    </form>
  )
}
```

```typescript
// features/products/components/product-list.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useProducts, useDeleteProduct } from '../hooks/use-products'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

export function ProductList() {
  const [search, setSearch] = useState('')
  const { data, isLoading, error } = useProducts({ search })
  const deleteProduct = useDeleteProduct()

  if (isLoading) return <LoadingSpinner />
  if (error) return <div>Error loading products</div>

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid gap-4">
        {data?.data.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-muted-foreground">
              {product.description}
            </p>
            <p className="font-bold mt-2">${product.price}</p>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteProduct.mutate(product.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

#### Step 8: Export Public API

```typescript
// features/products/index.ts
export { ProductForm } from './components/product-form'
export { ProductList } from './components/product-list'
export {
  useProducts,
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from './hooks/use-products'
export { productService } from './services/product.service'
export {
  createProductSchema,
  updateProductSchema,
} from './schemas/product.schema'
export type { Product, CreateProductInput, UpdateProductInput } from './types'
```

**Why index.ts?**
- Controls what's exported
- Clean imports
- Easy refactoring
- Encapsulation

#### Step 9: Create Page

```typescript
// app/(dashboard)/products/page.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ProductForm, ProductList } from '@/features/products'
import { ProtectedRoute, Can } from '@/features/auth'

export default function ProductsPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <ProtectedRoute permissions={['products:view']}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Products</h1>
          <Can permission="products:create">
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? 'View Products' : 'Create Product'}
            </Button>
          </Can>
        </div>

        {showForm ? (
          <ProductForm onSuccess={() => setShowForm(false)} />
        ) : (
          <ProductList />
        )}
      </div>
    </ProtectedRoute>
  )
}
```

#### Step 10: Add Permissions

```typescript
// types/auth.ts
export type Permission =
  | 'existing:permissions'
  | 'products:view'
  | 'products:create'
  | 'products:edit'
  | 'products:delete'
```

```typescript
// lib/permissions/roles.ts
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'existing:permissions',
    'products:view',
    'products:create',
    'products:edit',
    'products:delete',
  ],
  user: ['products:view'],
  guest: [],
}
```

### 6.2 Feature Checklist

When creating a new feature, ensure:

- [ ] Directory structure created
- [ ] Types defined
- [ ] Zod schemas created
- [ ] Service functions implemented
- [ ] TanStack Query hooks created
- [ ] Query keys added
- [ ] Components built
- [ ] Public API exported
- [ ] Page created
- [ ] Permissions added
- [ ] RBAC configured
- [ ] Tests written (if applicable)

---

## 7. Form Handling

### 7.1 Form Pattern

We use **React Hook Form + Zod** for all forms.

**Standard Form Template:**

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { yourSchema } from './schemas/your.schema'
import { YourInputType } from './types'
import { useYourMutation } from './hooks/use-your-feature'

export function YourForm() {
  const mutation = useYourMutation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<YourInputType>({
    resolver: zodResolver(yourSchema),
    defaultValues: {
      // your defaults
    },
  })

  const onSubmit = async (data: YourInputType) => {
    try {
      await mutation.mutateAsync(data)
      reset()
    } catch (error) {
      console.error('Failed:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="field">Field Label</Label>
        <Input id="field" {...register('field')} />
        {errors.field && (
          <p className="text-sm text-red-500">{errors.field.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  )
}
```

### 7.2 Common Form Patterns

**Number Input:**
```typescript
<Input
  type="number"
  {...register('price', { valueAsNumber: true })}
/>
```

**Checkbox:**
```typescript
<input type="checkbox" {...register('isActive')} />
```

**Select:**
```typescript
<select {...register('role')}>
  <option value="admin">Admin</option>
  <option value="user">User</option>
</select>
```

**Textarea:**
```typescript
<textarea {...register('description')} />
```

### 7.3 Validation Patterns

**Required Field:**
```typescript
z.string().min(1, 'This field is required')
```

**Email:**
```typescript
z.string().email('Invalid email address')
```

**Min/Max Length:**
```typescript
z.string().min(3).max(50)
```

**Number Range:**
```typescript
z.number().min(0).max(100)
```

**Custom Validation:**
```typescript
z.string().refine((val) => val !== 'admin', {
  message: "Cannot use 'admin' as username"
})
```

**Dependent Fields:**
```typescript
z.object({
  password: z.string(),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})
```

---

## 8. Data Fetching

### 8.1 TanStack Query Patterns

**Basic Query:**
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: () => fetchUsers(),
})
```

**Query with Parameters:**
```typescript
const { data } = useQuery({
  queryKey: ['users', { status: 'active' }],
  queryFn: () => fetchUsers({ status: 'active' }),
})
```

**Disabled Query:**
```typescript
const { data } = useQuery({
  queryKey: ['user', id],
  queryFn: () => fetchUser(id),
  enabled: !!id, // Only run when id exists
})
```

**Mutation:**
```typescript
const mutation = useMutation({
  mutationFn: (data) => createUser(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
  },
})
```

**Optimistic Update:**
```typescript
const mutation = useMutation({
  mutationFn: updateUser,
  onMutate: async (newData) => {
    await queryClient.cancelQueries({ queryKey: ['users'] })
    const previous = queryClient.getQueryData(['users'])
    queryClient.setQueryData(['users'], newData)
    return { previous }
  },
  onError: (err, variables, context) => {
    queryClient.setQueryData(['users'], context.previous)
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
  },
})
```

### 8.2 Loading States

```typescript
function MyComponent() {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
  })

  if (isLoading) return <LoadingSpinner />
  if (isError) return <div>Error: {error.message}</div>
  if (!data) return <EmptyState />

  return <DataDisplay data={data} />
}
```

### 8.3 Error Handling

```typescript
const { data, error } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
})

if (error) {
  return (
    <div className="text-red-500">
      Failed to load data. Please try again.
    </div>
  )
}
```

---

## 9. Authentication & Permissions

### 9.1 RBAC System

**Roles:**
- `admin` - Full access
- `user` - Limited access
- `guest` - Minimal access

**Permission Format:**
```typescript
'resource:action'
// Examples:
'users:view'
'users:create'
'products:edit'
'settings:delete'
```

### 9.2 Protecting Pages

```typescript
import { ProtectedRoute } from '@/features/auth'

export default function MyPage() {
  return (
    <ProtectedRoute permissions={['resource:view']}>
      <PageContent />
    </ProtectedRoute>
  )
}
```

### 9.3 Protecting Components

```typescript
import { Can } from '@/features/auth'

<Can permission="users:edit">
  <button>Edit</button>
</Can>
```

### 9.4 Using Hooks

```typescript
import { usePermission, useAuth } from '@/features/auth'

function MyComponent() {
  const { user, isAuthenticated } = useAuth()
  const canEdit = usePermission('users:edit')

  if (!isAuthenticated) return <LoginPrompt />
  if (!canEdit) return null

  return <EditButton />
}
```

### 9.5 Adding New Permissions

1. Add to `types/auth.ts`:
```typescript
type Permission = 'existing' | 'new:permission'
```

2. Assign to roles in `lib/permissions/roles.ts`:
```typescript
export const ROLE_PERMISSIONS = {
  admin: ['new:permission'],
  user: [],
}
```

3. Use it:
```typescript
<Can permission="new:permission">
  <NewFeature />
</Can>
```

---

## 10. Styling Guidelines

### 10.1 Tailwind CSS

We use Tailwind CSS for styling:

```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <h2 className="text-2xl font-bold">Title</h2>
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Click me
  </button>
</div>
```

### 10.2 Common Patterns

**Spacing:**
```tsx
className="space-y-4"      // Vertical spacing
className="space-x-4"      // Horizontal spacing
className="gap-4"          // Grid/Flex gap
```

**Responsive:**
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

**Dark Mode Ready:**
```tsx
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
```

### 10.3 shadcn/ui Components

Use shadcn/ui components for consistency:

```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

<Button variant="default">Click</Button>
<Button variant="outline">Cancel</Button>
<Button variant="destructive">Delete</Button>
```

**Adding New Components:**
```bash
npx shadcn@latest add [component-name]
```

---

## 11. Best Practices

### 11.1 Code Organization

✅ **Do:**
- Keep files under 300 lines
- One component per file
- Colocate related code
- Use meaningful names

❌ **Don't:**
- Mix business logic in components
- Create god files
- Deeply nest folders
- Use abbreviations

### 11.2 Component Design

✅ **Do:**
```tsx
// Small, focused components
function UserCard({ user }: { user: User }) {
  return (
    <Card>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </Card>
  )
}
```

❌ **Don't:**
```tsx
// Large, multi-purpose components
function UserManagementPage() {
  // 500 lines of code...
}
```

### 11.3 Type Safety

✅ **Do:**
```typescript
interface Props {
  user: User
  onEdit: (user: User) => void
}

function UserCard({ user, onEdit }: Props) {
  // Implementation
}
```

❌ **Don't:**
```typescript
function UserCard({ user, onEdit }: any) {
  // No type safety
}
```

### 11.4 Error Handling

✅ **Do:**
```typescript
try {
  await mutation.mutateAsync(data)
} catch (error) {
  console.error('Operation failed:', error)
  toast.error('Failed to save')
}
```

❌ **Don't:**
```typescript
mutation.mutateAsync(data) // Unhandled promise
```

### 11.5 Performance

✅ **Do:**
- Use React.memo for expensive components
- Implement virtualization for long lists
- Lazy load routes and components
- Optimize images

❌ **Don't:**
- Inline large objects in JSX
- Create new functions in render
- Fetch data in loops
- Ignore bundle size

---

## 12. Common Patterns

### 12.1 List with CRUD Operations

```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useItems, useDeleteItem } from '@/features/items'

export function ItemList() {
  const { data, isLoading } = useItems()
  const deleteItem = useDeleteItem()

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      {data?.data.map((item) => (
        <div key={item.id} className="flex justify-between items-center">
          <span>{item.name}</span>
          <Button
            variant="destructive"
            onClick={() => deleteItem.mutate(item.id)}
          >
            Delete
          </Button>
        </div>
      ))}
    </div>
  )
}
```

### 12.2 Modal Pattern

```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

export function CreateItemModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Item</Button>
      </DialogTrigger>
      <DialogContent>
        <ItemForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
```

### 12.3 Pagination

```typescript
function ItemList() {
  const [page, setPage] = useState(1)
  const { data } = useItems({ page, pageSize: 10 })

  return (
    <>
      <ItemGrid items={data?.data} />
      <div className="flex gap-2">
        <Button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= data?.pagination.totalPages}
        >
          Next
        </Button>
      </div>
    </>
  )
}
```

### 12.4 Search/Filter

```typescript
function ItemList() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ status: 'all' })

  const { data } = useItems({ search, ...filters })

  return (
    <>
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />
      <FilterSelect
        value={filters.status}
        onChange={(status) => setFilters({ ...filters, status })}
      />
      <ItemGrid items={data?.data} />
    </>
  )
}
```

---

## 13. Testing

### 13.1 Unit Tests

```typescript
// features/users/hooks/__tests__/use-users.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useUsers } from '../use-users'

const queryClient = new QueryClient()
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
)

describe('useUsers', () => {
  it('fetches users successfully', async () => {
    const { result } = renderHook(() => useUsers(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeDefined()
  })
})
```

### 13.2 Component Tests

```typescript
// features/users/components/__tests__/user-card.test.tsx
import { render, screen } from '@testing-library/react'
import { UserCard } from '../user-card'

describe('UserCard', () => {
  it('renders user information', () => {
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
    }

    render(<UserCard user={user} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })
})
```

---

## 14. Deployment

### 14.1 Build for Production

```bash
npm run build
```

### 14.2 Environment Variables

Create `.env.production`:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

### 14.3 Deployment Checklist

- [ ] Environment variables configured
- [ ] Build succeeds locally
- [ ] All tests passing
- [ ] TypeScript errors resolved
- [ ] Performance optimized
- [ ] SEO metadata added
- [ ] Error tracking configured
- [ ] Analytics setup
- [ ] Security headers configured

---

## 15. Troubleshooting

### 15.1 Common Issues

**Issue: "useAuth must be used within AuthProvider"**

Solution: Ensure AuthProvider is in `app/providers.tsx`

**Issue: Query not updating after mutation**

Solution: Invalidate queries after mutation:
```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['your-key'] })
}
```

**Issue: Form validation not working**

Solution: Check resolver is configured:
```typescript
useForm({
  resolver: zodResolver(yourSchema)
})
```

**Issue: Permission denied**

Solution: Check user has permission in `lib/permissions/roles.ts`

### 15.2 Debugging

**Enable TanStack Query DevTools:**
```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools />
</QueryClientProvider>
```

**Check Auth State:**
```tsx
const auth = useAuth()
console.log('Auth state:', auth)
```

**Monitor API Calls:**
Check Network tab in browser DevTools

---

## Conclusion

This guide covers the essential patterns and practices for developing features in this application. For more details, refer to:

- `FOLDER_STRUCTURE.md` - Detailed structure
- `RBAC.md` - Complete RBAC guide
- `EXAMPLES.md` - More code examples

**Happy coding!** 🚀

---

*Document Version: 1.0.0*
*Last Updated: January 2026*
