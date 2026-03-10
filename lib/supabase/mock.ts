import { DEMO_USER, DEMO_DATA } from "./demo-data"

function createMockQueryBuilder(tableName: string) {
  const tableData: unknown[] = (DEMO_DATA[tableName] ?? []) as unknown[]
  let _filtered = [...tableData]
  let _limited: number | null = null
  let _single = false
  let _maybeSingle = false
  let _headOnly = false
  let _selectCols = "*"

  const builder = {
    select(cols?: string, opts?: { count?: string; head?: boolean }) {
      _selectCols = cols ?? "*"
      if (opts?.head) _headOnly = true
      return builder
    },
    eq(col: string, val: unknown) {
      _filtered = _filtered.filter((row) => (row as Record<string, unknown>)[col] === val)
      return builder
    },
    in(col: string, vals: unknown[]) {
      _filtered = _filtered.filter((row) => vals.includes((row as Record<string, unknown>)[col]))
      return builder
    },
    ilike(col: string, pattern: string) {
      const regex = new RegExp(pattern.replace(/%/g, ".*"), "i")
      _filtered = _filtered.filter((row) => regex.test(String((row as Record<string, unknown>)[col] ?? "")))
      return builder
    },
    order(_col: string, _opts?: unknown) { return builder },
    limit(n: number) { _limited = n; return builder },
    single() { _single = true; return builder },
    maybeSingle() { _maybeSingle = true; return builder },
    update(_values: unknown) {
      return { eq: () => ({ error: null, data: null }) }
    },
    insert(_values: unknown) {
      return Promise.resolve({ error: null, data: null })
    },
    upsert(_values: unknown) {
      return { eq: () => ({ error: null, data: null }) }
    },
    then(resolve: (val: unknown) => unknown) {
      const limited = _limited !== null ? _filtered.slice(0, _limited) : _filtered
      if (_headOnly) return Promise.resolve({ data: null, count: _filtered.length, error: null }).then(resolve)
      if (_single) return Promise.resolve({ data: limited[0] ?? null, error: null }).then(resolve)
      if (_maybeSingle) return Promise.resolve({ data: limited[0] ?? null, error: null }).then(resolve)
      return Promise.resolve({ data: limited, error: null, count: limited.length }).then(resolve)
    },
  }
  return builder
}

export function createMockClient() {
  return {
    auth: {
      async getUser() {
        return { data: { user: DEMO_USER }, error: null }
      },
      async signOut() {
        return { error: null }
      },
      async signInWithPassword(_credentials: { email: string; password: string }) {
        return { data: { user: DEMO_USER, session: null }, error: null }
      },
      async signUp(_credentials: { email: string; password: string }) {
        return { data: { user: DEMO_USER, session: null }, error: null }
      },
      async resetPasswordForEmail(_email: string, _opts?: { redirectTo?: string }) {
        return { data: {}, error: null }
      },
      async updateUser(_attrs: { password?: string; email?: string; data?: Record<string, unknown> }) {
        return { data: { user: DEMO_USER }, error: null }
      },
    },
    from(tableName: string) {
      return createMockQueryBuilder(tableName)
    },
    channel(_name: string) {
      return {
        on(_event: string, _opts: unknown, _cb: unknown) { return this },
        subscribe() { return this },
      }
    },
    removeChannel(_channel: unknown) {
      return Promise.resolve("ok" as const)
    },
  }
}
