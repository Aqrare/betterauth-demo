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

export interface Database {
  member: MemberTable
}
