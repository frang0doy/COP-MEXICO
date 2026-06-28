'use client'

import { useEffect, useState, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import toast from 'react-hot-toast'

type Product = {
  id: number
  sku: string
  name: string
  category: string
  isNew?: boolean | null
  isActive?: boolean | null
  image?: string | null
  technicalSheet?: string | null
  price: number
  stock: number
}

type PendingChange = { isActive?: boolean; isNew?: boolean }

type SortKey = 'id' | 'sku' | 'name' | 'category'
type SortDir = 'asc' | 'desc'

const CATEGORIES = [
  'estucos', 'recubrimientos_decorativos', 'repellos',
  'impermeabilizantes', 'adhesivos', 'selladores_barnices', 'pinturas_masillas',
]

function downloadCsv(rows: Product[]) {
  const headers = ['id', 'sku', 'name', 'category', 'isNew', 'isActive']
  const esc = (v: any) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
  const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => esc((r as any)[h])).join(','))].join('\n')
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'productos-mx.csv'; a.click()
}

export default function AdminProductosPage() {
  const { data: session, status } = useSession()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [filterState, setFilterState] = useState('')
  const [filterNew, setFilterNew] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('id')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [saving, setSaving] = useState<number | null>(null)
  const [pending, setPending] = useState<Record<number, PendingChange>>({})

  useEffect(() => {
    if (status === 'loading') return
    if (!session) { setIsAdmin(false); setLoading(false); return }
    fetch('/api/me', { cache: 'no-store' }).then(r => r.json()).then(d => setIsAdmin(d?.user?.role === 'ADMIN')).catch(() => setIsAdmin(false))
  }, [session, status])

  const load = () => {
    setPending({})
    fetch('/api/admin/products', { cache: 'no-store' })
      .then(r => r.json()).then(d => { setProducts(d.products ?? []); setLoading(false) })
      .catch(() => { toast.error('Error al cargar productos'); setLoading(false) })
  }

  useEffect(() => { if (isAdmin === true) load() }, [isAdmin])

  const filtered = useMemo(() => {
    let list = [...products]
    if (search) { const q = search.toLowerCase(); list = list.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || String(p.id).includes(q) || p.category.toLowerCase().includes(q)) }
    if (filterCat) list = list.filter(p => p.category === filterCat)
    const effectiveActive = (p: Product) => pending[p.id]?.isActive !== undefined ? pending[p.id].isActive : p.isActive
    const effectiveNew = (p: Product) => pending[p.id]?.isNew !== undefined ? pending[p.id].isNew : p.isNew
    if (filterState === 'active') list = list.filter(p => effectiveActive(p) !== false)
    if (filterState === 'paused') list = list.filter(p => effectiveActive(p) === false)
    if (filterNew === 'yes') list = list.filter(p => effectiveNew(p))
    if (filterNew === 'no') list = list.filter(p => !effectiveNew(p))
    list.sort((a, b) => {
      const av = String((a as any)[sortKey] ?? ''), bv = String((b as any)[sortKey] ?? '')
      return sortDir === 'asc' ? av.localeCompare(bv, 'es', { numeric: true }) : bv.localeCompare(av, 'es', { numeric: true })
    })
    return list
  }, [products, search, filterCat, filterState, filterNew, sortKey, sortDir, pending])

  const total = products.length
  const pausados = products.filter(p => (pending[p.id]?.isActive !== undefined ? pending[p.id].isActive : p.isActive) === false).length

  const togglePause = (p: Product) => {
    const current = pending[p.id]?.isActive !== undefined ? pending[p.id].isActive : p.isActive
    setPending(prev => ({ ...prev, [p.id]: { ...prev[p.id], isActive: current !== false ? false : true } }))
  }

  const toggleNew = (p: Product) => {
    const current = pending[p.id]?.isNew !== undefined ? pending[p.id].isNew : p.isNew
    setPending(prev => ({ ...prev, [p.id]: { ...prev[p.id], isNew: !current } }))
  }

  const saveProduct = async (p: Product) => {
    const changes = pending[p.id]
    if (!changes || Object.keys(changes).length === 0) { toast('Sin cambios para guardar'); return }
    setSaving(p.id)
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(changes) })
      const d = await res.json()
      if (!res.ok) { toast.error(d.error || 'Error'); return }
      setProducts(prev => prev.map(x => x.id === p.id ? { ...x, ...d.product } : x))
      setPending(prev => { const n = { ...prev }; delete n[p.id]; return n })
      toast.success('Guardado')
    } catch { toast.error('Error') } finally { setSaving(null) }
  }

  if (status === 'loading' || isAdmin === null) return <main className="min-h-screen pt-24 bg-gray-100"><Navbar /><div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">Cargando...</div><Footer /></main>
  if (!session || isAdmin === false) return <main className="min-h-screen pt-24 bg-gray-100"><Navbar /><div className="max-w-7xl mx-auto px-4 py-12 text-center text-red-500 font-semibold">No autorizado</div><Footer /></main>

  const hasPending = Object.keys(pending).length > 0

  return (
    <main className="min-h-screen pt-24 bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Admin · Productos</h1>
            <p className="text-gray-500 mt-1">Pausá productos para que no aparezcan en el catálogo.</p>
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <div className="bg-white border border-gray-200 px-4 py-2 text-sm"><span className="text-gray-500">Total:</span> <span className="font-bold">{total}</span></div>
            <div className="bg-white border border-orange-200 px-4 py-2 text-sm"><span className="text-orange-600">Pausados:</span> <span className="font-bold text-orange-600">{pausados}</span></div>
            {hasPending && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold border border-yellow-300">
                {Object.keys(pending).length} cambio{Object.keys(pending).length > 1 ? 's' : ''} sin guardar
              </span>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Buscar</label>
            <input type="text" placeholder="ID, SKU, nombre o categoría..." value={search} onChange={e => setSearch(e.target.value)} className="w-full px-3 py-2 border border-gray-200 bg-white text-sm focus:border-black transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Categoría</label>
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="w-full px-3 py-2 border border-gray-200 bg-white text-sm focus:border-black transition-colors">
              <option value="">Todas</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Estado</label>
            <select value={filterState} onChange={e => setFilterState(e.target.value)} className="w-full px-3 py-2 border border-gray-200 bg-white text-sm focus:border-black transition-colors">
              <option value="">Todos</option>
              <option value="active">Activos</option>
              <option value="paused">Pausados</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Nuevo</label>
            <select value={filterNew} onChange={e => setFilterNew(e.target.value)} className="w-full px-3 py-2 border border-gray-200 bg-white text-sm focus:border-black transition-colors">
              <option value="">Todos</option>
              <option value="yes">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        {/* Sort + actions */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Orden</label>
            <select value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)} className="px-3 py-1.5 border border-gray-200 bg-white text-sm focus:border-black transition-colors">
              <option value="id">ID</option>
              <option value="sku">SKU</option>
              <option value="name">Nombre</option>
              <option value="category">Categoría</option>
            </select>
            <button onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')} className="px-3 py-1.5 border border-gray-200 bg-white text-sm font-semibold hover:border-black transition-colors">{sortDir === 'asc' ? 'Asc' : 'Desc'}</button>
          </div>
          <div className="ml-auto flex gap-3">
            <button onClick={() => downloadCsv(filtered)} className="px-4 py-1.5 border border-gray-200 bg-white text-sm font-semibold hover:border-black transition-colors">Exportar CSV</button>
            <button onClick={() => { setLoading(true); load() }} className="px-4 py-1.5 bg-black text-white text-sm font-semibold hover:bg-orange-500 transition-colors">Refrescar</button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">Cargando productos...</div>
        ) : (
          <div className="bg-white border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-black text-white">
                  <tr>
                    {['ID', 'SKU', 'Nombre', 'Categoría', 'Nuevo', 'Estado', 'Acciones'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(p => {
                    const effectiveActive = pending[p.id]?.isActive !== undefined ? pending[p.id].isActive : p.isActive
                    const effectiveNew = pending[p.id]?.isNew !== undefined ? pending[p.id].isNew : p.isNew
                    const hasPendingRow = !!pending[p.id]
                    return (
                      <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${effectiveActive === false ? 'opacity-60' : ''} ${hasPendingRow ? 'bg-yellow-50' : ''}`}>
                        <td className="px-4 py-3 text-gray-400 text-xs">{p.id}</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">{p.sku}</td>
                        <td className="px-4 py-3 font-medium max-w-[220px]">
                          <span className="line-clamp-2">{p.name}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">{p.category.replace(/_/g, ' ')}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleNew(p)}
                            disabled={saving === p.id}
                            className={`px-2 py-0.5 text-xs font-semibold transition-colors ${effectiveNew ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                          >
                            {effectiveNew ? 'Sí' : 'No'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-xs font-semibold ${effectiveActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {effectiveActive !== false ? 'Activo' : 'Pausado'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => togglePause(p)}
                              disabled={saving === p.id}
                              className={`px-3 py-1 text-xs font-semibold border transition-colors disabled:opacity-50 ${effectiveActive !== false ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                            >
                              {effectiveActive !== false ? 'Pausar' : 'Activar'}
                            </button>
                            <button
                              onClick={() => saveProduct(p)}
                              disabled={saving === p.id || !hasPendingRow}
                              className={`px-3 py-1 text-xs font-semibold border transition-colors disabled:opacity-40 ${hasPendingRow ? 'border-black bg-black text-white hover:bg-gray-800' : 'border-gray-200 text-gray-400 cursor-not-allowed'}`}
                            >
                              {saving === p.id ? '...' : 'Guardar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No hay productos que coincidan</div>}
            <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">{filtered.length} de {total} productos</div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
