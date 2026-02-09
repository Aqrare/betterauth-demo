import { createMiddleware } from "hono/factory";

const AUTH_MS_URL = process.env.AUTH_MS_URL || "http://localhost:3000";

interface ApiKeyVerificationResult {
  valid: boolean;
  userId: string;
  organizationId: string | null;
  permissions: string[];
}

/**
 * API Key認証ミドルウェア
 * AuthorizationヘッダーからAPI Keyを取得し、Auth MSに検証を依頼する
 */
export const apiKeyAuth = () => {
  return createMiddleware(async (c, next) => {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json(
        {
          error: "Unauthorized",
          message: "API Key required in Authorization header",
        },
        401,
      );
    }

    const apiKey = authHeader.substring(7); // "Bearer " を除去

    try {
      // Auth MSにAPI Keyを検証依頼
      const response = await fetch(`${AUTH_MS_URL}/api/apikey/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
      });

      if (!response.ok) {
        const error = await response.json();
        return c.json(
          {
            error: "Unauthorized",
            message: error.message || "Invalid API key",
          },
          401,
        );
      }

      const result = await response.json();
      const data: ApiKeyVerificationResult = result.data;

      // contextにユーザー情報とpermissionsを保存
      c.set("userId", data.userId);
      c.set("organizationId", data.organizationId);
      c.set("permissions", data.permissions);
      c.set("authMethod", "apikey");

      await next();
    } catch (error) {
      console.error("Error verifying API key:", error);
      return c.json(
        {
          error: "Internal Server Error",
          message: "Failed to verify API key",
        },
        500,
      );
    }
  });
};
