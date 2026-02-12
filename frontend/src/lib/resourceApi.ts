

const RESOURCE_MS_URL = import.meta.env.VITE_RESOURCE_MS_URL || ''
const AUTH_URL = import.meta.env.VITE_AUTH_URL || ''


export async function getJWTToken(): Promise<string | null> {
  try {
    const response = await fetch(`${AUTH_URL}/api/auth/token`, {
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
