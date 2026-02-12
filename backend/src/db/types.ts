/**
 * データベーススキーマの型定義
 */

export interface MemberTable {
  id: string
  service_id: string
  user_id: string
  role: 'owner' | 'admin' | 'member'
  created_at: Date
}

export interface ApiKeyTable {
  id: string
  name: string
  key: string
  user_id: string
  organization_id: string | null
  prefix: string
  start: string
  enabled: boolean
  remaining: number | null
  expires_at: Date | null
  rate_limit_enabled: boolean
  rate_limit_time_window: number
  rate_limit_max: number
  request_count: number
  last_request: Date | null
  refill_interval: number | null
  refill_amount: number | null
  last_refill_at: Date | null
  permissions: string | null
  metadata: string | null
  created_at: Date
  updated_at: Date
}

export interface Database {
  member: MemberTable
  apikey: ApiKeyTable
}
