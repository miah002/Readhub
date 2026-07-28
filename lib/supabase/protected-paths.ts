const PROTECTED_PREFIXES = ['/dashboard', '/repository', '/content']

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}
