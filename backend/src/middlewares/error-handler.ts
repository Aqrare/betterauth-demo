import type { Context } from 'hono'
import { AppError } from '../lib/errors.js'
import { ZodError } from 'zod'

/**
 * 集約エラーハンドリングミドルウェア
 * すべてのエラーを統一的に処理し、適切なHTTPレスポンスに変換
 */
export const errorHandler = (err: Error, c: Context) => {
  // カスタムエラー
  if (err instanceof AppError) {
    return c.json(
      {
        error: err.message,
        code: err.code,
      },
      err.statusCode
    )
  }

  // Zod バリデーションエラー
  if (err instanceof ZodError) {
    return c.json(
      {
        error: 'Validation Error',
        code: 'VALIDATION_ERROR',
        details: err.errors,
      },
      400
    )
  }

  // 予期しないエラー
  console.error('Unexpected error:', err)
  return c.json(
    {
      error: 'Internal Server Error',
      code: 'INTERNAL_SERVER_ERROR',
    },
    500
  )
}
