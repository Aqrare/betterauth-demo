import type { OPAInput } from "./types.js"

const OPA_URL = process.env.OPA_URL || ""

/**
 * OPAで認可判定を行う
 */
export const checkPermission = async (input: OPAInput): Promise<boolean> => {
  try {
    const response = await fetch(`${OPA_URL}/v1/data/authz/allow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    })

    if (!response.ok) {
      console.error("OPA request failed:", response.statusText)
      return false
    }

    const data = (await response.json()) as { result?: boolean }

    return data.result ?? false
  } catch (error) {
    console.error("Error checking permission with OPA:", error)
    return false
  }
}
