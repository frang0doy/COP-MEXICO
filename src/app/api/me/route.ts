import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isAdminEmail } from '@/lib/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      customerType: true,
      wholesaleStatus: true,
    },
  })

  if (user?.email && isAdminEmail(user.email) && user.role !== 'ADMIN') {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' as any },
      select: {
        id: true, email: true, name: true, role: true,
        customerType: true, wholesaleStatus: true,
      },
    })
    return NextResponse.json({ user: updated }, { headers: { 'Cache-Control': 'no-store' } })
  }

  return NextResponse.json({ user }, { headers: { 'Cache-Control': 'no-store' } })
}
