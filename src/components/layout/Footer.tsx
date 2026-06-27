'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Mail, MapPin, Phone, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Footer() {
  const instagramUrl = 'https://www.instagram.com/coprecubrimientos'
  const facebookUrl = ''
  const email = 'info@coprecubrimientos.com'

  const locations = [
    {
      name: 'Planta Mérida',
      address: 'Carretera Mérida - Motul, km 14.5',
      city: 'Mocochá, Yucatán. CP 97050',
      phone: '+52 999 571 3848',
      mapsQuery: 'Carretera Merida Motul km 14.5 Mococha Yucatan Mexico',
    },
    {
      name: 'CEDIS COP Cancún',
      address: 'SM307 MZ305, Blvd. Luis Donaldo y Alfredo B. Bonfil',
      city: 'C.P. 77560 Cancún, Q. Roo',
      phone: '+52 998 282 2014',
      mapsQuery: 'SM307 MZ305 Blvd Luis Donaldo Cancun Quintana Roo Mexico',
    },
  ]

  return (
    <footer className="bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center sm:text-left">

          {/* Company Info */}
          <div className="flex flex-col items-center sm:items-start">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="relative h-12 w-28 mb-4"
            >
              <Image
                src="/images/logocop.png"
                alt="COP - Materiales de Construcción"
                width={112}
                height={48}
                className="object-contain"
              />
            </motion.div>
            <p className="mb-6 text-gray-400 leading-relaxed">
              Recubrimientos y soluciones para la construcción. Calidad y asesoramiento técnico para profesionales en México.
            </p>
            <div className="flex justify-center sm:justify-start space-x-4">
              <motion.a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 border border-gray-700 rounded-full flex items-center justify-center hover:border-orange-500 hover:text-orange-500 hover:bg-orange-500/10 transition-all"
                aria-label="Instagram de COP"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              {facebookUrl ? (
                <motion.a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 border border-gray-700 rounded-full flex items-center justify-center hover:border-orange-500 hover:text-orange-500 hover:bg-orange-500/10 transition-all"
                  aria-label="Facebook de COP"
                >
                  <Facebook className="w-5 h-5" />
                </motion.a>
              ) : (
                <div
                  className="w-10 h-10 border border-gray-700 rounded-full flex items-center justify-center opacity-40 cursor-not-allowed"
                  title="Facebook (próximamente)"
                >
                  <Facebook className="w-5 h-5" />
                </div>
              )}
              <motion.a
                href={`mailto:${email}`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 border border-gray-700 rounded-full flex items-center justify-center hover:border-orange-500 hover:text-orange-500 hover:bg-orange-500/10 transition-all"
                aria-label="Enviar email a COP"
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Inicio' },
                { href: '/productos', label: 'Productos' },
                { href: '/empresa', label: 'Empresa' },
                { href: '/tutoriales-cop', label: 'Tutoriales' },
                { href: '/contacto', label: 'Contacto' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-400 hover:text-orange-500 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold mb-6 text-lg">Nuestras Ubicaciones</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {locations.map((loc) => (
                <div key={loc.name} className="space-y-3">
                  <p className="text-white font-medium text-sm uppercase tracking-wide border-b border-gray-800 pb-2">
                    {loc.name}
                  </p>
                  <motion.a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.mapsQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start space-x-3 group hover:text-orange-500 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    <span className="text-gray-400 text-sm group-hover:text-orange-500 transition-colors">
                      {loc.address}
                      <br />
                      {loc.city}
                    </span>
                  </motion.a>
                  <motion.a
                    href={`tel:${loc.phone.replace(/\s/g, '')}`}
                    className="flex items-center space-x-3 group hover:text-orange-500 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <Phone className="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    <span className="text-gray-400 text-sm group-hover:text-orange-500 transition-colors">{loc.phone}</span>
                  </motion.a>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <motion.a
                href={`mailto:${email}`}
                className="flex items-center space-x-3 group hover:text-orange-500 transition-colors"
                whileHover={{ x: 4 }}
              >
                <Mail className="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-orange-500 transition-colors" />
                <span className="text-gray-400 text-sm group-hover:text-orange-500 transition-colors">{email}</span>
              </motion.a>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 flex-shrink-0 text-gray-400" />
                <span className="text-gray-400 text-sm">Lun – Vie: 08:00 – 18:00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} COP Recubrimientos México. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
