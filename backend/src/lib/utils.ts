export const toSnakeCase = (str: string): string =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

export const toSnakeCaseFields = <T extends readonly string[]>(
  keys: T
): Record<T[number], string> => {
  return Object.fromEntries(
    keys.map((key) => [key, toSnakeCase(key)])
  ) as Record<T[number], string>
}

export const buildPluginSchema = <T>(tables: T) => {
  return { schema: tables }
}
