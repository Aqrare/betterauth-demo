import type { Article } from "../lib/types.js"
import type {
  CreateArticleInput,
  UpdateArticleInput,
} from "../dtos/article.dto.js"

const articles: Map<string, Article> = new Map()

export const articleService = {
  getAll: async (): Promise<Article[]> => {
    return Array.from(articles.values());
  },

  getById: async (id: string): Promise<Article | null> => {
    return articles.get(id) ?? null;
  },

  create: async (
    input: CreateArticleInput,
    authorId: string,
    serviceId: string | null,
  ): Promise<Article> => {
    const article: Article = {
      id: crypto.randomUUID(),
      ...input,
      authorId,
      serviceId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    articles.set(article.id, article);
    return article;
  },

  update: async (
    id: string,
    input: UpdateArticleInput,
  ): Promise<Article | null> => {
    const article = articles.get(id);
    if (!article) return null;

    const updatedArticle: Article = {
      ...article,
      ...input,
      updatedAt: new Date(),
    };
    articles.set(id, updatedArticle);
    return updatedArticle;
  },

  delete: async (id: string): Promise<boolean> => {
    return articles.delete(id);
  },
};
