import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PRODUCTS } from '@/components/products/catalog'

export const dynamic = 'force-dynamic'

async function ensureSeed() {
  const count = await prisma.product.count()
  if (count > 0) return
  for (const p of PRODUCTS) {
    const sku = (p as any).sku?.trim?.() ? (p as any).sku.trim() : `COP-${String(p.id).padStart(2, '0')}`
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        sku,
        name: p.name,
        description: p.description,
        category: p.category,
        price: p.price ?? 0,
        stock: p.stock ?? 0,
        image: p.image ?? null,
        isNew: Boolean(p.isNew),
        technicalSheet: p.technicalSheet ?? null,
        isActive: true,
      },
    })
  }
}

export async function GET() {
  await ensureSeed()
  const products = await prisma.product.findMany({
    where: { isActive: { not: false } },
    orderBy: { id: 'asc' },
    select: { id: true, isActive: true, isNew: true },
  })
  return NextResponse.json({ products })
}
