import type { Context, Next } from "hono"
import type { JWTPayload, OPAInput } from "../lib/types.js"
import { getPermissions } from "../lib/permissions.js"
import { checkPermission } from "../lib/opaClient.js"

/**
 * OPA認可ミドルウェア
 * ユーザーの権限を取得し、OPAで認可判定
 */
export const opaMiddleware = async (c: Context, next: Next) => {
  const user = c.get("user") as JWTPayload | undefined
  if (!user) {
    return c.json({ error: "Unauthorized: User not found" }, 401)
  }

  // ユーザーの権限を取得
  const permissions = getPermissions(user.role, user.organizationRole)

  // ヘッダーからサービスIDを取得
  const serviceIdHeader = c.req.header("X-Service-ID") ?? null

  // OPAに送信する情報を構築
  const opaInput: OPAInput = {
    user: {
      id: user.sub,
      role: user.role,
      serviceId: user.serviceId,
      organizationRole: user.organizationRole,
      permissions,
    },
    request: {
      method: c.req.method,
      path: c.req.path,
      serviceId: serviceIdHeader,
    },
  };

  // OPAで認可判定
  const allowed = await checkPermission(opaInput)

  if (!allowed) {
    return c.json(
      {
        error: "Forbidden: You don't have permission to access this resource",
      },
      403
    )
  }

  await next()
}
