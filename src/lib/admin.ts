export function getAdminEmails(): string[] {
  // Admins fijos del proyecto.
  const owners = ['franciscogodoy_@hotmail.com', 'pedidoscoprecubrimientos@gmail.com']

  const list = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  // Siempre incluimos al owner y completamos con TODOS los emails del env.
  // Si agregás más de uno en ADMIN_EMAILS (separados por coma), todos tienen acceso admin.
  const unique = Array.from(
    new Set([...owners, ...list].map((e) => e.trim().toLowerCase()).filter(Boolean))
  )
  return unique
}

export function isAdminEmail(email?: string | null): boolean {
  const e = (email || '').trim().toLowerCase()
  if (!e) return false
  return getAdminEmails().includes(e)
}

