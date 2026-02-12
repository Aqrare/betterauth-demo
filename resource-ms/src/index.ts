import { Hono } from "hono"
import { cors } from "hono/cors"
import { articleRoutes } from "./routes/article.routes.js"

const app = new Hono()

app.onError((err, c) => {
  console.error("Error:", err)
  return c.json({ error: err.message }, 500)
})

app.use("*", cors())

app.get("/health", (c) => c.json({ status: "ok" }))

app.route("/articles", articleRoutes)

const PORT = process.env.PORT || 4001

console.log(`Server running on http://localhost:${PORT}`)

export default {
  port: PORT,
  fetch: app.fetch,
}
