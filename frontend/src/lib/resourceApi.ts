/**
 * Resource MS APIクライアント
 */

const RESOURCE_MS_URL = import.meta.env.VITE_RESOURCE_MS_URL || 'http://localhost:4001'

/**
 * JWTトークンを取得
 */
export async function getJWTToken(): Promise<string | null> {
  try {
    const response = await fetch('http://localhost:3000/api/auth/token', {
      credentials: 'include', // Cookieを含める
    })

    if (!response.ok) {
      throw new Error('Failed to get JWT token')
    }

    const data = await response.json()
    return data.token || data.jwt || data.accessToken || null
  } catch (error) {
    console.error('Error getting JWT token:', error)
    return null
  }
}

/**
 * JWT認証テスト（一般ユーザーでもアクセス可能）
 */
export async function testJWTAuth(token: string) {
  const response = await fetch(`${RESOURCE_MS_URL}/api/test`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'JWT認証に失敗しました')
  }

  return await response.json()
}

/**
 * 管理者権限テスト（管理者のみアクセス可能）
 */
export async function testAdminAuth(token: string) {
  const response = await fetch(`${RESOURCE_MS_URL}/api/admin/test`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '管理者権限が必要です')
  }

  return await response.json()
}
