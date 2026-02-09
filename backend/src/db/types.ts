/**
 * データベーススキーマの型定義
 */

export interface MemberTable {
  id: string
  organizationId: string
  userId: string
  role: 'owner' | 'admin' | 'member'
  createdAt: Date
}

export interface ApiKeyTable {
  id: string
  name: string
  key: string
  userId: string
  organizationId: string | null
  prefix: string
  start: string
  enabled: boolean
  remaining: number | null
  expiresAt: Date | null
  rateLimitEnabled: boolean
  rateLimitTimeWindow: number
  rateLimitMax: number
  requestCount: number
  lastRequest: Date | null
  refillInterval: number | null
  refillAmount: number | null
  lastRefillAt: Date | null
  permissions: string | null
  metadata: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Database {
  member: MemberTable
  apikey: ApiKeyTable
}
