/** Adapta os parâmetros posicionais usados nos serviços ao PostgreSQL. */
export function postgresSql(sql: string) {
  let index = 0
  return sql
    .replace(/(\b[a-z_][a-z0-9_]*\s*=\s*)\?\s+COLLATE\s+NOCASE/gi, (_match, lhs: string) => `LOWER(${lhs.trim().replace(/\s*=\s*$/, '')}) = LOWER($${++index})`)
    .replace(/\bLIKE\s+\?/gi, 'ILIKE ?')
    .replace(/\?/g, () => `$${++index}`)
    .replace(/\b(\w+\.)?ativo\s*=\s*1\b/gi, (_match, prefix: string) => `${prefix ?? ''}ativo = TRUE`)
    .replace(/\b(\w+\.)?ativo\s*=\s*0\b/gi, (_match, prefix: string) => `${prefix ?? ''}ativo = FALSE`)
}

export function queryRaw<T = unknown>(client: any, sql: string, ...values: unknown[]): Promise<T[]> {
  return client.$queryRawUnsafe<T[]>(postgresSql(sql), ...values)
}

export function executeRaw(client: any, sql: string, ...values: unknown[]): Promise<number> {
  return client.$executeRawUnsafe(postgresSql(sql), ...values)
}
