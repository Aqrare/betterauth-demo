import { z } from 'zod'

/**
 * API Key DTOs (Zod Schemas)
 */

// API Key エンティティ
export const ApiKeySchema = z.object({
  id: z.string(),
  name: z.string(),
  prefix: z.string(),
  start: z.string(),
  organizationId: z.string().nullable(),
  createdAt: z.string(),
  expiresAt: z.string().nullable(),
  enabled: z.boolean(),
})

// API Key作成リクエスト
export const CreateApiKeyRequestSchema = z.object({
  name: z.string().min(3, '名前は3文字以上である必要があります').max(50, '名前は50文字以内である必要があります'),
  expiresIn: z.number().int().positive().optional().describe('有効期限（秒）'),
  prefix: z.string().optional().describe('キーのプレフィックス'),
  permissions: z.array(z.string()).optional().default([]).describe('API Keyに付与するpermissions'),
})

// API Key作成レスポンス
export const CreateApiKeyResponseSchema = z.object({
  data: ApiKeySchema.extend({
    key: z.string().describe('生成されたAPIキー（一度だけ表示）'),
  }),
})

// API Key一覧レスポンス
export const ListApiKeysResponseSchema = z.object({
  data: z.array(ApiKeySchema),
})

// API Key削除レスポンス
export const DeleteApiKeyResponseSchema = z.object({
  success: z.boolean(),
})

// エラーレスポンス
export const ErrorResponseSchema = z.object({
  error: z.string(),
})

// 型エクスポート
export type CreateApiKeyRequest = z.infer<typeof CreateApiKeyRequestSchema>
export type CreateApiKeyResponse = z.infer<typeof CreateApiKeyResponseSchema>
export type ListApiKeysResponse = z.infer<typeof ListApiKeysResponseSchema>
export type DeleteApiKeyResponse = z.infer<typeof DeleteApiKeyResponseSchema>
export type ApiKey = z.infer<typeof ApiKeySchema>
