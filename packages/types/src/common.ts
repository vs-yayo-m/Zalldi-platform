export type Nullable < T > = T | null
export type Optional < T > = T | undefined
export type AsyncResult < T > = Promise < { data: T;error: null } | { data: null;error: string } >