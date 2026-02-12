import type { Permission, GlobalRole, OrganizationRole } from "./types.js"
import { GLOBAL_ROLES, ORGANIZATION_ROLES } from "./types.js"


// グローバルロール → 権限
const GLOBAL_ROLE_PERMISSIONS: Record<GlobalRole, Permission[]> = {
  [GLOBAL_ROLES.ADMIN]: [
  ],
  [GLOBAL_ROLES.USER]: [],
};

// 組織ロール → 権限
const ORGANIZATION_ROLE_PERMISSIONS: Record<OrganizationRole, Permission[]> = {
  [ORGANIZATION_ROLES.OWNER]: [
    "articles:create",
    "articles:read",
    "articles:update",
    "articles:delete",
  ],
  [ORGANIZATION_ROLES.ADMIN]: [
    "articles:create",
    "articles:read",
    "articles:update",
    "articles:delete",
  ],
  [ORGANIZATION_ROLES.MEMBER]: ["articles:create", "articles:read"],
}


export const getPermissions = (
  globalRole: GlobalRole,
  organizationRole: OrganizationRole | null
): Permission[] => {
  const globalPermissions = GLOBAL_ROLE_PERMISSIONS[globalRole] || []

  const orgPermissions = organizationRole
    ? ORGANIZATION_ROLE_PERMISSIONS[organizationRole] || []
    : []

  return Array.from(new Set([...globalPermissions, ...orgPermissions]))
}
