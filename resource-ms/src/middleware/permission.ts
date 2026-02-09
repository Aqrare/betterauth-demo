import { createMiddleware } from "hono/factory";

/**
 * Permission照合ミドルウェア
 * 指定されたpermissionsをユーザーが持っているか確認する
 *
 * @param requiredPermissions - 必要なpermissions（OR条件）
 */
export const requirePermissions = (...requiredPermissions: string[]) => {
  return createMiddleware(async (c, next) => {
    const userPermissions = c.get("permissions") as string[] | undefined;

    if (!userPermissions) {
      return c.json(
        {
          error: "Forbidden",
          message: "No permissions found. Authentication required.",
        },
        403,
      );
    }

    // 必要なpermissionsのいずれかを持っているか確認
    const hasPermission = requiredPermissions.some((required) =>
      userPermissions.includes(required),
    );

    if (!hasPermission) {
      return c.json(
        {
          error: "Forbidden",
          message: `Required permissions: ${requiredPermissions.join(" or ")}. Your permissions: ${userPermissions.join(", ")}`,
        },
        403,
      );
    }

    await next();
  });
};

/**
 * Permission照合ミドルウェア（AND条件）
 * 指定されたすべてのpermissionsをユーザーが持っているか確認する
 *
 * @param requiredPermissions - 必要なpermissions（AND条件）
 */
export const requireAllPermissions = (...requiredPermissions: string[]) => {
  return createMiddleware(async (c, next) => {
    const userPermissions = c.get("permissions") as string[] | undefined;

    if (!userPermissions) {
      return c.json(
        {
          error: "Forbidden",
          message: "No permissions found. Authentication required.",
        },
        403,
      );
    }

    // すべての必要なpermissionsを持っているか確認
    const hasAllPermissions = requiredPermissions.every((required) =>
      userPermissions.includes(required),
    );

    if (!hasAllPermissions) {
      const missingPermissions = requiredPermissions.filter(
        (required) => !userPermissions.includes(required),
      );

      return c.json(
        {
          error: "Forbidden",
          message: `Missing required permissions: ${missingPermissions.join(", ")}. Your permissions: ${userPermissions.join(", ")}`,
        },
        403,
      );
    }

    await next();
  });
};
