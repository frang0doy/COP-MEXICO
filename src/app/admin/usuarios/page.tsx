'use client'

import { useEffect, useState, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import toast from 'react-hot-toast'

type User = {
  id: string
  email: string
  name: string | null
  role: string
  customerType: string | null
  createdAt: string
}

function downloadCsv(rows: User[]) {
  const headers = ['name', 'email', 'role', 'createdAt']
  const esc = (v: any) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
  const csv = [headers.join(','), ...rows.map(r => headers.map(h => esc((r as any)[h])).join(','))].join('\n')
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'usuarios-mx.csv'; a.click()
}

export default function AdminUsuariosPage() {
  const { data: session, status } = useSession()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    if (status === 'loading') return
    if (!session) { setIsAdmin(false); setLoading(false); return }
    fetch('/api/me', { cache: 'no-store' }).then(r => r.json()).then(d => setIsAdmin(d?.user?.role === 'ADMIN')).catch(() => setIsAdmin(false))
  }, [session, status])

  const load = () => {
    fetch('/api/admin/users', { cache: 'no-store' })
      .then(r => r.json()).then(d => { setUsers(d.users ?? []); setLoading(false) })
      .catch(() => { toast.error('Error al cargar usuarios'); setLoading(false) })
  }

  useEffect(() => { if (isAdmin === true) load() }, [isAdmin])

  const filtered = useMemo(() => {
    let list = [...users]
    if (search) { const q = search.toLowerCase(); list = list.filter(u => (u.email + ' ' + (u.name ?? '')).toLowerCase().includes(q)) }
    if (filterRole) list = list.filter(u => u.role === filterRole)
    list.sort((a, b) => {
      const av = new Date(a.createdAt).getTime(), bv = new Date(b.createdAt).getTime()
      return sortDir === 'desc' ? bv - av : av - bv
    })
    return list
  }, [users, search, filterRole, sortDir])

  const deleteUser = async (u: User) => {
    if (!confirm(`¿Eliminar usuario ${u.email}?`)) return
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, { method: 'DELETE' })
      if (!res.ok) { toast.error('Error al eliminar'); return }
      setUsers(prev => prev.filter(x => x.id !== u.id))
      toast.success('Usuario eliminado')
    } catch { toast.error('Error') }
  }

  const toggleAdmin = async (u: User) => {
    const newRole = u.role === 'ADMIN' ? 'USER' : 'ADMIN'
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role: newRole }) })
      const d = await res.json()
      if (!res.ok) { toast.error(d.error || 'Error'); return }
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, role: d.user.role } : x))
      toast.success(`Rol actualizado a ${d.user.role}`)
    } catch { toast.error('Error') }
  }

  if (status === 'loading' || isAdmin === null) return <main className="min-h-screen pt-24 bg-gray-100"><Navbar /><div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">Cargando...</div><Footer /></main>
  if (!session || isAdmin === false) return <main className="min-h-screen pt-24 bg-gray-100"><Navbar /><div className="max-w-7xl mx-auto px-4 py-12 text-center text-red-500 font-semibold">No autorizado</div><Footer /></main>

  return (
    <main className="min-h-screen pt-24 bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Admin · Usuarios</h1>
            <p className="text-gray-500 mt-1">Usuarios registrados en la web.</p>
          </div>
          <div className="bg-white border border-gray-200 px-4 py-2 text-sm">
            <span className="text-gray-500">Total:</span> <span className="font-bold">{users.length}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 p-5 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Buscar</label>
            <input type="text" placeholder="Email o nombre..." value={search} onChange={e => setSearch(e.target.value)} className="w-full px-3 py-2 border border-gray-200 bg-white text-sm focus:border-black transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Rol</label>
            <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="w-full px-3 py-2 border border-gray-200 bg-white text-sm focus:border-black transition-colors">
              <option value="">Todos</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">Usuario</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Orden</label>
            <div className="flex gap-2">
              <select className="flex-1 px-3 py-2 border border-gray-200 bg-white text-sm focus:border-black transition-colors" disabled>
                <option>Fecha de alta</option>
              </select>
              <button onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')} className="px-3 py-2 border border-gray-200 bg-white text-sm font-semibold hover:border-black transition-colors">{sortDir === 'desc' ? 'Desc' : 'Asc'}</button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">{filtered.length} de {users.length} usuarios</span>
          <div className="flex gap-3">
            <button onClick={() => downloadCsv(filtered)} className="px-4 py-1.5 border border-gray-200 bg-white text-sm font-semibold hover:border-black transition-colors">Exportar CSV</button>
            <button onClick={() => { setLoading(true); load() }} className="px-4 py-1.5 bg-black text-white text-sm font-semibold hover:bg-orange-500 transition-colors">Refrescar</button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">Cargando usuarios...</div>
        ) : (
          <div className="bg-white border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-black text-white">
                  <tr>
                    {['Usuario', 'Rol', 'Alta', 'Acciones'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-black">{u.name || '—'}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{u.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs font-semibold ${u.role === 'ADMIN' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                          {u.role === 'ADMIN' ? 'Admin' : 'Usuario'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => toggleAdmin(u)} className={`px-3 py-1 border text-xs font-semibold transition-colors ${u.role === 'ADMIN' ? 'border-gray-200 text-gray-600 hover:border-black' : 'border-orange-200 text-orange-600 hover:bg-orange-50'}`}>
                            {u.role === 'ADMIN' ? 'Quitar admin' : 'Hacer admin'}
                          </button>
                          <button onClick={() => deleteUser(u)} className="px-3 py-1 border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors">
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No hay usuarios que coincidan</div>}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
