import { apiClient } from '@/lib/api/client'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { User, CreateUserInput, UpdateUserInput } from '../types'

export const userService = {
  getUsers: async (params?: {
    search?: string
    role?: string
    page?: number
    pageSize?: number
  }): Promise<PaginatedResponse<User>> => {
    const queryParams = new URLSearchParams(
      params as Record<string, string>
    ).toString()
    return apiClient.get<PaginatedResponse<User>>(
      `/users?${queryParams}`
    )
  },

  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    return apiClient.get<ApiResponse<User>>(`/users/${id}`)
  },

  createUser: async (data: CreateUserInput): Promise<ApiResponse<User>> => {
    return apiClient.post<ApiResponse<User>>('/users', data)
  },

  updateUser: async (
    id: string,
    data: UpdateUserInput
  ): Promise<ApiResponse<User>> => {
    return apiClient.put<ApiResponse<User>>(`/users/${id}`, data)
  },

  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(`/users/${id}`)
  },
}
