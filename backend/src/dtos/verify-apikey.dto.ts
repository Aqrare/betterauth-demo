import { z } from 'zod'

/**
 * API Key検証リクエスト
 */
export const VerifyApiKeyRequestSchema = z.object({
  apiKey: z.string().min(1, 'API Key is required'),
})

export type VerifyApiKeyRequest = z.infer<typeof VerifyApiKeyRequestSchema>

/**
 * API Key検証レスポンス（成功）
 */
export const VerifyApiKeySuccessSchema = z.object({
  data: z.object({
    valid: z.literal(true),
    userId: z.string(),
    organizationId: z.string().nullable(),
    permissions: z.array(z.string()),
  }),
})

/**
 * API Key検証レスポンス（エラー）
 */
export const VerifyApiKeyErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
})

export type VerifyApiKeyResponse = z.infer<typeof VerifyApiKeySuccessSchema>
export type VerifyApiKeyError = z.infer<typeof VerifyApiKeyErrorResponseSchema>
