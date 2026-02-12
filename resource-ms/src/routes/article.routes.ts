import { Hono } from "hono"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { opaMiddleware } from "../middlewares/opa.middleware.js"
import { articleController } from "../controllers/article.controller.js"

export const articleRoutes = new Hono()

articleRoutes.use("*", authMiddleware, opaMiddleware)

articleRoutes.get("/", articleController.getAll)
articleRoutes.get("/:id", articleController.getById)
articleRoutes.post("/", articleController.create)
articleRoutes.put("/:id", articleController.update)
articleRoutes.delete("/:id", articleController.delete)
