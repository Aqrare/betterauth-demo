// ============================================
// Role Definitions
// ============================================

// グローバルロール（サービス全体）
export const GLOBAL_ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const

export type GlobalRole = (typeof GLOBAL_ROLES)[keyof typeof GLOBAL_ROLES]

// 組織ロール（Organization内）
export const ORGANIZATION_ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
} as const

export type OrganizationRole =
  (typeof ORGANIZATION_ROLES)[keyof typeof ORGANIZATION_ROLES]

// ============================================
// Article型定義
// ============================================

export type Article = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  serviceId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// ============================================
// JWT Payload型定義（Auth MSの実装に基づく）
// ============================================

export type JWTPayload = {
  sub: string; // ユーザーID
  role: GlobalRole; // グローバルロール
  twoFactorEnabled: boolean;
  serviceId: string | null;
  organizationRole: OrganizationRole | null;
  exp?: number;
  iat?: number;
};

// ============================================
// Permission型定義
// ============================================

export type Permission = string // "articles:create", "articles:read", etc.

// ============================================
// OPA Input型定義
// ============================================

export type OPAInput = {
  user: {
    id: string;
    role: GlobalRole;
    serviceId: string | null;
    organizationRole: OrganizationRole | null;
    permissions: Permission[];
  };
  request: {
    method: string; // "GET", "POST", "PUT", "DELETE"
    path: string; // "/articles", "/articles/123"
    serviceId: string | null; // ヘッダーから取得したサービスID
  };
  resource?: {
    type: "article";
    serviceId: string | null;
    id?: string;
  };
};

