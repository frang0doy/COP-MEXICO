'use client'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AnimatedTitle from '@/components/ui/AnimatedTitle'
import AnimatedParagraph from '@/components/ui/AnimatedParagraph'
import Image from 'next/image'
import { Mail, Phone, Clock, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

const locations = [
  {
    name: 'Planta Mérida',
    address: 'Carretera Mérida - Motul, km 14.5',
    city: 'Mocochá, Yucatán. CP 97050',
    phone: '+52 999 571 3848',
    mapsQuery: 'Carretera Merida Motul km 14.5 Mococha Yucatan Mexico',
    embedSrc: 'https://www.google.com/maps?q=Carretera+Merida+Motul+km+14.5+Mococha+Yucatan+Mexico&hl=es&z=14&output=embed',
  },
  {
    name: 'CEDIS COP Cancún',
    address: 'SM307 MZ305, Blvd. Luis Donaldo y Alfredo B. Bonfil',
    city: 'C.P. 77560 Cancún, Q. Roo',
    phone: '+52 998 282 2014',
    mapsQuery: 'SM307 MZ305 Blvd Luis Donaldo Cancun Quintana Roo Mexico',
    embedSrc: 'https://www.google.com/maps?q=SM307+MZ305+Blvd+Luis+Donaldo+Cancun+Quintana+Roo&hl=es&z=14&output=embed',
  },
]

const valueItems: Array<{ label: string; icon: React.ReactNode }> = [
  {
    label: 'RESPETO',
    icon: (
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M6 14l4-8 4 8" /><path d="M4 14h16" /><path d="M7 18h10" />
      </svg>
    ),
  },
  {
    label: 'RESPONSABILIDAD',
    icon: (
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M12 3v4" /><path d="M7 6h10" /><path d="M6 21a6 6 0 1 1 12 0" /><path d="M12 11v4l3 2" />
      </svg>
    ),
  },
  {
    label: 'HONESTIDAD',
    icon: (
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M12 3l7 4v6c0 5-3 8-7 8s-7-3-7-8V7l7-4z" /><path d="M9 12l2 2 4-5" />
      </svg>
    ),
  },
  {
    label: 'COMPROMISO',
    icon: (
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M9 11l3 3 8-8" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    label: 'EXCELENCIA',
    icon: (
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M12 2l2.7 5.6 6.2.9-4.5 4.4 1.1 6.2L12 16.9 6.5 19l1.1-6.2L3.1 8.5l6.2-.9L12 2z" />
      </svg>
    ),
  },
  {
    label: 'CONFIANZA',
    icon: (
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10z" />
      </svg>
    ),
  },
]

export default function EmpresaPage() {
  return (
    <main className="min-h-screen pt-24 bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">

        {/* Hero */}
        <div className="max-w-4xl mb-12 md:mb-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-black mb-8 md:mb-12 leading-tight tracking-tight">
            <AnimatedTitle as="span" className="" delay={0.2}>SOMOS</AnimatedTitle>
            {' '}
            <AnimatedTitle as="span" className="text-brand-orange" delay={0.5}>COP</AnimatedTitle>
          </h1>
          <div className="space-y-6 md:space-y-8">
            <AnimatedParagraph className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed" delay={0.4}>
              En <span className="text-brand-orange font-semibold">COP</span> creamos recubrimientos decorativos innovadores para brindar la calidad y espíritu que cada proyecto merece.
            </AnimatedParagraph>
            <AnimatedParagraph className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed" delay={0.6}>
              Buscamos convertirnos en el referente de confianza de cada cliente que nos elige, mediante la honestidad y calidad de servicio que nos define.
            </AnimatedParagraph>
          </div>
        </div>

        {/* Quiénes somos */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-7xl mx-auto mb-16 md:mb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-6">
              <div className="relative">
                <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                  <div className="relative aspect-[16/11]">
                    <Image src="/images/cop1.jpg" alt="COP México" fill sizes="(min-width: 1024px) 520px, 100vw" className="object-cover" priority={false} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                  </div>
                </div>
                <div className="hidden sm:block absolute -bottom-10 -left-10 w-[58%] max-w-[340px] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
                  <div className="relative aspect-square">
                    <Image src="/images/cop2.png" alt="COP - Aplicación" fill sizes="340px" className="object-cover" />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black tracking-tight">¿Quiénes somos?</h2>
              <p className="mt-5 text-base md:text-lg text-gray-700 leading-relaxed">
                Somos una empresa con más de 35 años de experiencia en la producción, venta y aplicación de materiales para la construcción. Llegamos a México para ofrecer la misma calidad y respaldo técnico que nos distingue, con presencia en Yucatán y Quintana Roo.
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
                <div className="rounded-3xl bg-black text-white p-7 shadow-sm">
                  <div className="text-white/70 text-xs tracking-widest uppercase">Trayectoria</div>
                  <div className="mt-3 text-4xl font-bold leading-none">35+</div>
                  <div className="mt-2 text-sm text-white/80">Años de experiencia</div>
                  <div className="mt-6 h-px bg-white/10" />
                  <div className="mt-5 text-xs text-white/70 leading-relaxed">Asesoramiento técnico y soporte en obra.</div>
                </div>
                <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
                  <div className="text-sm font-semibold text-gray-900 mb-3">Lo que nos define</div>
                  <ul className="space-y-3 text-sm md:text-base text-gray-700">
                    {['Estándares de calidad', 'Mejora continua', 'Innovación'].map((t) => (
                      <li key={t} className="flex items-start gap-3">
                        <span className="mt-2 h-2 w-2 rounded-full bg-orange-500 shrink-0" />
                        <span className="leading-relaxed">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Misión / Visión / Objetivos */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-7xl mx-auto mb-16 md:mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="md:col-span-7 rounded-3xl border border-gray-200 bg-white p-8 md:p-10 shadow-sm relative overflow-hidden">
              <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-orange-200/40 blur-3xl" />
              <div className="relative">
                <div className="text-xs tracking-widest uppercase text-gray-500">Misión</div>
                <h3 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-black">Fabricar soluciones confiables e innovadoras</h3>
                <p className="mt-4 text-base md:text-lg text-gray-700 leading-relaxed">
                  Somos una empresa líder en la fabricación de recubrimientos para la industria de la construcción, con el objetivo de satisfacer las necesidades de quienes nos eligen, brindando productos de calidad enfocados en la innovación.
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="md:col-span-5 rounded-3xl border border-orange-200 bg-gradient-to-br from-white to-orange-50 p-8 md:p-10 shadow-sm">
              <div className="text-xs tracking-widest uppercase text-gray-500">Visión</div>
              <h3 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-black">Ser la elección N°1 en recubrimientos</h3>
              <p className="mt-4 text-base md:text-lg text-gray-700 leading-relaxed">Convertirnos en la empresa de referencia en fabricación y venta de recubrimientos en México.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="md:col-span-12 rounded-3xl border border-gray-200 bg-white p-8 md:p-10 shadow-sm">
              <div className="text-xs tracking-widest uppercase text-gray-500">Objetivos</div>
              <h3 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-black">Una marca sólida en cada obra</h3>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Transmitir calidad y durabilidad, asociándose a productos confiables y de alto desempeño.',
                  'Proyectar innovación, demostrando desarrollo continuo y soluciones modernas.',
                  'Consolidarse como la elección segura para instaladores, arquitectos y constructoras.',
                  'Destacar la facilidad de instalación, aportando eficiencia y practicidad al proceso constructivo.',
                  'Comunicar una excelente relación costo–beneficio, reforzando el valor de la inversión.',
                  'Ser reconocida como empresa seria y responsable, con soporte y cumplimiento institucional.',
                ].map((o) => (
                  <div key={o} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-orange-500 shrink-0" />
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">{o}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Valores */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-7xl mx-auto mb-16 md:mb-20"
        >
          <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-semibold text-black tracking-tight">Nuestros Valores</h2>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 md:gap-6">
            {valueItems.map((v) => (
              <div key={v.label} className="group rounded-3xl bg-white border border-gray-200 p-6 md:p-7 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 border border-orange-100">
                  {v.icon}
                </div>
                <div className="mt-4 text-xs md:text-sm font-semibold tracking-widest text-gray-900">{v.label}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Ubicaciones */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-7xl mx-auto mb-16 md:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black tracking-tight mb-10">Nuestras Ubicaciones</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {locations.map((loc) => (
              <div key={loc.name} className="space-y-6">
                <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-sm space-y-5">
                  <h3 className="text-xl font-semibold text-black border-b border-gray-100 pb-3">{loc.name}</h3>

                  <motion.a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.mapsQuery)}`} target="_blank" rel="noopener noreferrer" className="flex items-start space-x-4 group hover:text-orange-500 transition-colors" whileHover={{ x: 4 }}>
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500 transition-colors">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-black group-hover:text-orange-500 transition-colors mb-1">Dirección</p>
                      <p className="text-sm text-gray-700">{loc.address}<br />{loc.city}</p>
                    </div>
                  </motion.a>

                  <motion.a href={`tel:${loc.phone.replace(/\s/g, '')}`} className="flex items-start space-x-4 group hover:text-orange-500 transition-colors" whileHover={{ x: 4 }}>
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500 transition-colors">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-black group-hover:text-orange-500 transition-colors mb-1">Teléfono</p>
                      <p className="text-sm text-gray-700">{loc.phone}</p>
                    </div>
                  </motion.a>

                  <motion.a href="mailto:info@coprecubrimientos.com" className="flex items-start space-x-4 group hover:text-orange-500 transition-colors" whileHover={{ x: 4 }}>
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500 transition-colors">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-black group-hover:text-orange-500 transition-colors mb-1">Email</p>
                      <p className="text-sm text-gray-700">info@coprecubrimientos.com</p>
                    </div>
                  </motion.a>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-black mb-1">Horario de Atención</p>
                      <p className="text-sm text-gray-700">Lun – Vie: 08:00 – 18:00</p>
                    </div>
                  </div>
                </div>

                <div className="h-64 rounded-3xl overflow-hidden shadow-lg border border-gray-200">
                  <iframe
                    src={loc.embedSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Mapa ${loc.name}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.section>

      </div>
      <Footer />
    </main>
  )
}
