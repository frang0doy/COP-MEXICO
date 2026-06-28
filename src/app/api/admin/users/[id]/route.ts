import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isAdminEmail } from '@/lib/admin'

export const dynamic = 'force-dynamic'

const BodySchema = z.object({
  role: z.enum(['ADMIN', 'USER']).optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  if (!session.user.email || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  const userId = (params.id || '').trim()
  if (!userId) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  try {
    const json = await req.json()
    const body = BodySchema.parse(json)
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: body.role as any },
      select: { id: true, email: true, name: true, role: true },
    })
    return NextResponse.json({ user: updated })
  } catch (e: any) {
    return NextResponse.json({ error: e?.name === 'ZodError' ? 'Datos inválidos' : e?.message ?? 'Error' }, { status: 400 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  if (!session.user.email || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  const userId = (params.id || '').trim()
  if (!userId) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  await prisma.user.delete({ where: { id: userId } })
  return NextResponse.json({ ok: true })
}
