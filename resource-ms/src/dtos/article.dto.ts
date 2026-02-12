import { z } from "zod"

// 記事作成のスキーマ
export const createArticleSchema = z.object({
  title: z.string().min(1, "タイトルは必須です").max(200),
  content: z.string().min(1, "本文は必須です"),
})

// 記事更新のスキーマ
export const updateArticleSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
})

// 型をエクスポート
export type CreateArticleInput = z.infer<typeof createArticleSchema>
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>
