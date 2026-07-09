'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { User, Mail, Settings, Phone, MapPin, Save, Shield, Pencil, X } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

type Me = {
  id: string
  email: string
  name?: string | null
  phone?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  zipCode?: string | null
  role?: 'USER' | 'ADMIN'
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [me, setMe] = useState<Me | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', state: '', zipCode: '' })

  useEffect(() => {
    if (!session?.user) return
    let cancelled = false
    setLoading(true)
    ;(async () => {
      const res = await fetch('/api/me', { cache: 'no-store' })
      const data = await res.json().catch(() => ({}))
      if (cancelled) return
      if (!res.ok) { toast.error(data?.error || 'Error al cargar perfil'); setLoading(false); return }
      const user = data?.user as Me
      setMe(user)
      setForm({
        name: user?.name ?? '',
        phone: user?.phone ?? '',
        address: user?.address ?? '',
        city: user?.city ?? '',
        state: user?.state ?? '',
        zipCode: user?.zipCode ?? '',
      })
      setLoading(false)
    })()
    return () => { cancelled = true }
  }, [session])

  const onSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/me/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { toast.error(data?.error || 'No se pudo guardar'); return }
      setMe(data.user as Me)
      setEditing(false)
      toast.success('Perfil actualizado')
    } finally { setSaving(false) }
  }

  const onCancel = () => {
    setForm({
      name: me?.name ?? '',
      phone: me?.phone ?? '',
      address: me?.address ?? '',
      city: me?.city ?? '',
      state: me?.state ?? '',
      zipCode: me?.zipCode ?? '',
    })
    setEditing(false)
  }

  if (!session) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-600 mb-4">Debés iniciar sesión para ver tu perfil</p>
        <Link href="/auth/login" className="font-semibold text-black hover:text-gray-600 transition-colors">Iniciar Sesión</Link>
      </div>
    )
  }

  const fieldClass = (base = '') =>
    `mt-1 w-full px-3 py-2 border rounded-lg focus:ring-0 transition-colors bg-white ${base} ${
      editing ? 'border-gray-300 focus:border-black' : 'border-transparent bg-gray-50 text-gray-800 cursor-default'
    }`

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm font-semibold text-gray-700 hover:border-black transition-colors disabled:opacity-40"
                >
                  <Pencil className="w-4 h-4" />
                  Editar datos
                </button>
              ) : (
                <button
                  onClick={onCancel}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm font-semibold text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
              )}
            </div>

            {loading ? (
              <div className="py-8 text-center text-gray-400">Cargando...</div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-3" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                      readOnly={!editing}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={fieldClass()}
                      placeholder="Tu nombre"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-3" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 px-3 py-2 text-gray-800 bg-gray-50 rounded-lg">{me?.email || session.user?.email || '—'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-3" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <input
                      readOnly={!editing}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={fieldClass()}
                      placeholder={editing ? 'Ej: +52 999 000 0000' : '—'}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-3" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Dirección</label>
                    <textarea
                      readOnly={!editing}
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      rows={2}
                      className={fieldClass()}
                      placeholder={editing ? 'Calle, número, etc.' : '—'}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                      <input readOnly={!editing} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={fieldClass()} placeholder={editing ? 'Ciudad' : '—'} />
                      <input readOnly={!editing} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={fieldClass()} placeholder={editing ? 'Estado' : '—'} />
                      <input readOnly={!editing} value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} className={fieldClass()} placeholder={editing ? 'CP' : '—'} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {editing && (
              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={onSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-black text-white px-6 py-2 hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mt-8 opacity-40 pointer-events-none select-none">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Pedidos</h2>
            <p className="text-sm text-gray-500">Próximamente disponible.</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Accesos Rápidos</h2>
            <div className="space-y-2">
              {me?.role === 'ADMIN' && (
                <Link href="/admin/productos" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">Admin productos</span>
                </Link>
              )}
              {me?.role === 'ADMIN' && (
                <Link href="/admin/usuarios" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">Admin usuarios</span>
                </Link>
              )}
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition text-left">
                <Settings className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Configuración</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
