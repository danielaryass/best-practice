# Code Examples & Patterns

This document provides practical examples of common patterns used in this project.

## Table of Contents

1. [Creating a New Feature](#creating-a-new-feature)
2. [Building Forms](#building-forms)
3. [Data Fetching](#data-fetching)
4. [API Integration](#api-integration)
5. [Component Patterns](#component-patterns)

---

## Creating a New Feature

### Step-by-Step Guide

Let's create a "Products" feature as an example.

#### 1. Create Directory Structure

```bash
mkdir -p features/products/{components,hooks,schemas,services}
```

#### 2. Define Types

```typescript
// features/products/types.ts
import { z } from 'zod'
import { createProductSchema } from './schemas/product.schema'

export interface Product {
  id: string
  name: string
  price: number
  description: string
  category: string
  inStock: boolean
  createdAt: string
}

export type CreateProductInput = z.infer<typeof createProductSchema>
```

#### 3. Create Zod Schema

```typescript
// features/products/schemas/product.schema.ts
import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  price: z.number().min(0, 'Price must be positive'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  inStock: z.boolean().default(true),
})

export const updateProductSchema = createProductSchema.partial()
```

#### 4. Create Service

```typescript
// features/products/services/product.service.ts
import { apiClient } from '@/lib/api/client'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { Product, CreateProductInput } from '../types'

export const productService = {
  getProducts: async (): Promise<PaginatedResponse<Product>> => {
    return apiClient.get<PaginatedResponse<Product>>('/products')
  },

  getProductById: async (id: string): Promise<ApiResponse<Product>> => {
    return apiClient.get<ApiResponse<Product>>(`/products/${id}`)
  },

  createProduct: async (data: CreateProductInput): Promise<ApiResponse<Product>> => {
    return apiClient.post<ApiResponse<Product>>('/products', data)
  },
}
```

#### 5. Create Hooks

```typescript
// features/products/hooks/use-products.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/api/query-keys'
import { productService } from '../services/product.service'
import { CreateProductInput } from '../types'

export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products.lists(),
    queryFn: () => productService.getProducts(),
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProductInput) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
    },
  })
}
```

#### 6. Add Query Keys

```typescript
// lib/api/query-keys.ts (add to existing file)
products: {
  all: ['products'] as const,
  lists: () => [...queryKeys.products.all, 'list'] as const,
  details: () => [...queryKeys.products.all, 'detail'] as const,
  detail: (id: string) => [...queryKeys.products.details(), id] as const,
}
```

#### 7. Export Public API

```typescript
// features/products/index.ts
export { useProducts, useCreateProduct } from './hooks/use-products'
export { productService } from './services/product.service'
export { createProductSchema } from './schemas/product.schema'
export type { Product, CreateProductInput } from './types'
```

---

## Building Forms

### Basic Form with Validation

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createProductSchema } from './schemas/product.schema'
import { CreateProductInput } from './types'
import { useCreateProduct } from './hooks/use-products'

export function ProductForm() {
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
      category: '',
      inStock: true,
    },
  })

  const onSubmit = async (data: CreateProductInput) => {
    try {
      await createProduct.mutateAsync(data)
      reset()
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
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="inStock"
          {...register('inStock')}
          className="h-4 w-4"
        />
        <Label htmlFor="inStock">In Stock</Label>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Product'}
      </Button>
    </form>
  )
}
```

---

## Data Fetching

### List with Loading & Error States

```tsx
'use client'

import { useProducts } from '@/features/products'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { EmptyState } from '@/components/shared/empty-state'

export function ProductList() {
  const { data, isLoading, error } = useProducts()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="text-red-500">
        Failed to load products. Please try again.
      </div>
    )
  }

  if (!data?.data.length) {
    return (
      <EmptyState
        title="No products found"
        description="Get started by creating your first product"
        action={{
          label: 'Create Product',
          onClick: () => console.log('Create'),
        }}
      />
    )
  }

  return (
    <div className="grid gap-4">
      {data.data.map((product) => (
        <div key={product.id} className="border rounded-lg p-4">
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.description}</p>
          <p className="font-bold mt-2">${product.price}</p>
        </div>
      ))}
    </div>
  )
}
```

### Mutation with Optimistic Updates

```typescript
export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.products.lists() })

      // Snapshot previous value
      const previousProducts = queryClient.getQueryData(
        queryKeys.products.lists()
      )

      // Optimistically update
      queryClient.setQueryData(queryKeys.products.lists(), (old: any) => ({
        ...old,
        data: old.data.filter((p: any) => p.id !== id),
      }))

      return { previousProducts }
    },
    onError: (err, id, context) => {
      // Rollback on error
      queryClient.setQueryData(
        queryKeys.products.lists(),
        context?.previousProducts
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
    },
  })
}
```

---

## API Integration

### Mock API Route

```typescript
// app/api/products/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const products = [
    {
      id: '1',
      name: 'Product 1',
      price: 29.99,
      description: 'A great product',
      category: 'electronics',
      inStock: true,
      createdAt: new Date().toISOString(),
    },
  ]

  return NextResponse.json({
    data: products,
    pagination: {
      page: 1,
      pageSize: 10,
      total: products.length,
      totalPages: 1,
    },
  })
}

export async function POST(request: Request) {
  const body = await request.json()

  const newProduct = {
    id: Math.random().toString(),
    ...body,
    createdAt: new Date().toISOString(),
  }

  return NextResponse.json({
    data: newProduct,
    success: true,
  })
}
```

---

## Component Patterns

### Compound Components

```tsx
// components/shared/card.tsx
interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={`rounded-lg border bg-card ${className}`}>
      {children}
    </div>
  )
}

Card.Header = function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="p-6 pb-4">{children}</div>
}

Card.Title = function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold">{children}</h3>
}

Card.Content = function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="p-6 pt-0">{children}</div>
}

// Usage
<Card>
  <Card.Header>
    <Card.Title>Products</Card.Title>
  </Card.Header>
  <Card.Content>
    <ProductList />
  </Card.Content>
</Card>
```

### Render Props

```tsx
interface DataFetcherProps<T> {
  queryKey: string[]
  queryFn: () => Promise<T>
  children: (data: T, isLoading: boolean, error: Error | null) => React.ReactNode
}

export function DataFetcher<T>({ queryKey, queryFn, children }: DataFetcherProps<T>) {
  const { data, isLoading, error } = useQuery({ queryKey, queryFn })

  return <>{children(data as T, isLoading, error as Error | null)}</>
}

// Usage
<DataFetcher
  queryKey={['products']}
  queryFn={productService.getProducts}
>
  {(data, isLoading, error) => {
    if (isLoading) return <LoadingSpinner />
    if (error) return <div>Error</div>
    return <ProductList products={data.data} />
  }}
</DataFetcher>
```

### Custom Hooks Pattern

```typescript
// hooks/use-pagination.ts
import { useState } from 'react'

export function usePagination(initialPage = 1, initialPageSize = 10) {
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const nextPage = () => setPage((p) => p + 1)
  const previousPage = () => setPage((p) => Math.max(1, p - 1))
  const goToPage = (page: number) => setPage(page)
  const changePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
  }

  return {
    page,
    pageSize,
    nextPage,
    previousPage,
    goToPage,
    changePageSize,
  }
}

// Usage
function ProductsPage() {
  const { page, pageSize, nextPage, previousPage } = usePagination()
  const { data } = useProducts({ page, pageSize })

  return (
    <>
      <ProductList products={data?.data} />
      <div>
        <button onClick={previousPage}>Previous</button>
        <button onClick={nextPage}>Next</button>
      </div>
    </>
  )
}
```

---

## Testing Examples

### Component Test

```typescript
// features/products/components/__tests__/product-form.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductForm } from '../product-form'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('ProductForm', () => {
  it('validates required fields', async () => {
    render(<ProductForm />, { wrapper: Wrapper })

    const submitButton = screen.getByRole('button', { name: /create/i })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/name must be at least/i)).toBeInTheDocument()
    })
  })
})
```

---

This document will be updated as new patterns emerge in the project.
