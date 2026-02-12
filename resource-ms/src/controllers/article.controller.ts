import type { Context } from "hono"
import type { JWTPayload } from "../lib/types.js"
import {
  createArticleSchema,
  updateArticleSchema,
} from "../dtos/article.dto.js"
import { articleService } from "../services/article.service.js"

export const articleController = {
  getAll: async (c: Context) => {
    const articles = await articleService.getAll()
    return c.json(articles)
  },

  getById: async (c: Context) => {
    const id = c.req.param("id")
    const article = await articleService.getById(id)

    if (!article) {
      return c.json({ error: "Article not found" }, 404)
    }

    return c.json(article)
  },

  create: async (c: Context) => {
    const user = c.get("user") as JWTPayload
    const body = await c.req.json()
    const validated = createArticleSchema.parse(body)

    const article = await articleService.create(
      validated,
      user.sub,
      user.serviceId
    )

    return c.json(article, 201)
  },

  update: async (c: Context) => {
    const id = c.req.param("id")
    const body = await c.req.json()
    const validated = updateArticleSchema.parse(body)

    const article = await articleService.update(id, validated)

    if (!article) {
      return c.json({ error: "Article not found" }, 404)
    }

    return c.json(article)
  },

  delete: async (c: Context) => {
    const id = c.req.param("id")
    const deleted = await articleService.delete(id)

    if (!deleted) {
      return c.json({ error: "Article not found" }, 404)
    }

    return c.json({ message: "Article deleted successfully" })
  },
}
