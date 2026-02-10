import { toSnakeCaseFields, buildPluginSchema } from './utils.js'

export const userSchema = {
  fields: toSnakeCaseFields(["emailVerified", "createdAt", "updatedAt"] as const),
};

export const sessionSchema = {
  fields: toSnakeCaseFields([
    "userId",
    "expiresAt",
    "ipAddress",
    "userAgent",
    "createdAt",
    "updatedAt",
  ] as const),
};

export const accountSchema = {
  fields: toSnakeCaseFields([
    "userId",
    "accountId",
    "providerId",
    "accessToken",
    "refreshToken",
    "accessTokenExpiresAt",
    "refreshTokenExpiresAt",
    "idToken",
    "createdAt",
    "updatedAt",
  ] as const),
  accountLinking: {
    enabled: true,
    trustedProviders: ["google"] as string[],
  },
};

export const verificationSchema = {
  fields: toSnakeCaseFields(["expiresAt", "createdAt", "updatedAt"] as const),
};

export const adminSchema = buildPluginSchema({
  user: {
    fields: toSnakeCaseFields(["banReason", "banExpires"] as const),
  },
  session: {
    fields: toSnakeCaseFields(["impersonatedBy"] as const),
  },
});

export const twoFactorSchema = buildPluginSchema({
  twoFactor: {
    fields: toSnakeCaseFields(["userId", "backupCodes"] as const),
  },
  user: {
    fields: toSnakeCaseFields(["twoFactorEnabled"] as const),
  },
});

export const jwtSchema = buildPluginSchema({
  jwks: {
    fields: toSnakeCaseFields([
      "publicKey",
      "privateKey",
      "createdAt",
      "expiresAt",
    ] as const),
  },
});

export const passkeySchema = buildPluginSchema({
  passkey: {
    fields: toSnakeCaseFields([
      "userId",
      "publicKey",
      "credentialID",
      "backedUp",
      "deviceType",
      "createdAt",
    ] as const),
  },
});

export const organizationSchema = buildPluginSchema({
  organization: {
    modelName: "services",
    fields: toSnakeCaseFields(["createdAt", "updatedAt"] as const),
  },
  member: {
    fields: {
      // 特殊なマッピング: services テーブルを参照するため
      organizationId: "service_id",
      ...toSnakeCaseFields(["userId", "createdAt"] as const),
    },
  },
  invitation: {
    fields: {
      // 特殊なマッピング: services テーブルを参照するため
      organizationId: "service_id",
      ...toSnakeCaseFields(["inviterId", "expiresAt", "createdAt"] as const),
    },
  },
  session: {
    fields: {
      // 特殊なマッピング: services テーブルを参照するため
      activeOrganizationId: "active_service_id",
    },
  },
});

export const apiKeySchema = buildPluginSchema({
  apikey: {
    fields: toSnakeCaseFields([
      "userId",
      "expiresAt",
      "createdAt",
      "updatedAt",
      "refillInterval",
      "refillAmount",
      "lastRefillAt",
      "rateLimitEnabled",
      "rateLimitTimeWindow",
      "rateLimitMax",
      "requestCount",
      "lastRequest",
    ] as const),
  },
});
