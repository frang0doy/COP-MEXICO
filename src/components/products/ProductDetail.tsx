'use client'

import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Download,
  Calculator,
  X,
} from 'lucide-react'
import Link from 'next/link'
import {
  CATEGORY_LABEL,
  CATEGORY_THEME,
  PRODUCTS,
  productHidesDetailDescription,
  getGalleryImagePathsById,
  getTechnicalSummaryById,
  type CategoryKey,
  type Product,
} from './catalog'
import ConsumptionCalculatorModal from './ConsumptionCalculatorModal'
import { detectGroupBaseName, detectVariantLabel, normText } from './variantGrouping'
import { getColorSamplePath } from './productColorSamples'

interface ProductDetailProps {
  productId: string
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [variants, setVariants] = useState<Product[]>([])
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCalculator, setShowCalculator] = useState(false)
  const [galleryMode, setGalleryMode] = useState<'product' | 'color'>('product')
  const [productPhotoIndex, setProductPhotoIndex] = useState(0)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  useEffect(() => {
    const id = parseInt(productId, 10)
    const found = PRODUCTS.find((p) => p.id === id) ?? null
    if (found) {
      const base = detectGroupBaseName(found.name)
      const groupVariants = base
        ? PRODUCTS.filter((p) => detectGroupBaseName(p.name) === base).sort((a, b) => a.id - b.id)
        : [found]
      setProduct(found)
      setVariants(groupVariants)
      setSelectedVariantId(found.id)
    }
    setIsLoading(false)
  }, [productId])

  useEffect(() => {
    setProductPhotoIndex(0)
    setGalleryMode('product')
  }, [selectedVariantId])

  useEffect(() => {
    if (!lightboxSrc) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxSrc(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxSrc])

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-500">Cargando producto...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-500">Producto no encontrado</p>
          <Link href="/productos" className="text-black hover:text-gray-600 transition-colors mt-4 inline-block">
            Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  const selectedProduct = variants.find((v) => v.id === selectedVariantId) ?? product

  const categoryKey: CategoryKey =
    selectedProduct.category in CATEGORY_THEME
      ? (selectedProduct.category as CategoryKey)
      : 'adhesivos'

  const theme = CATEGORY_THEME[categoryKey]
  const categoryLabel = categoryKey in CATEGORY_LABEL ? CATEGORY_LABEL[categoryKey] : 'Producto'

  const technicalSummary = getTechnicalSummaryById(selectedProduct.id)

  const groupBase = detectGroupBaseName(selectedProduct.name)
  const variantLabelForGallery = detectVariantLabel(selectedProduct.name, groupBase)
  const colorSampleSrc = groupBase ? getColorSamplePath(groupBase, variantLabelForGallery) : null
  const productImageSrc = selectedProduct.image ?? ''
  const rawGallery = getGalleryImagePathsById(selectedProduct.id) ?? []
  const uniqueProductPhotos = Array.from(new Set([productImageSrc, ...rawGallery].filter(Boolean)))
  const hasMultiProductPhotos = uniqueProductPhotos.length > 1
  const primaryProductSrc =
    uniqueProductPhotos[Math.min(productPhotoIndex, uniqueProductPhotos.length - 1)] ?? productImageSrc
  const hasColorProductToggle = Boolean(colorSampleSrc && productImageSrc)
  const mainGallerySrc =
    colorSampleSrc && (!productImageSrc || galleryMode === 'color')
      ? colorSampleSrc
      : primaryProductSrc || colorSampleSrc

  const variantLabels =
    variants.length > 1
      ? Array.from(
          new Set(
            variants.map((v) => detectVariantLabel(v.name, detectGroupBaseName(v.name))).filter(Boolean)
          )
        )
      : []

  function formatSpanishList(items: string[]): string {
    const clean = items.map((s) => s.trim()).filter(Boolean)
    if (clean.length === 0) return ''
    if (clean.length === 1) return clean[0]!
    if (clean.length === 2) return `${clean[0]} y ${clean[1]}`
    return `${clean.slice(0, -1).join(', ')} y ${clean[clean.length - 1]}`
  }

  const titleParts = selectedProduct.name.trim().split(/\s+/).filter(Boolean)
  const titleFirst = titleParts[0] ?? ''
  const titleRest = titleParts.slice(1).join(' ')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link
        href="/productos"
        className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al catálogo</span>
      </Link>

      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="h-1 w-full bg-gray-100">
          <div className={['h-1 w-28', theme.accent].join(' ')} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Imagen */}
          <div className="bg-gray-50 p-4 sm:p-10 flex flex-col items-center justify-center">
            <div className="w-full flex flex-col items-center justify-center gap-4">
              {mainGallerySrc ? (
                <div className="w-full">
                  <button
                    type="button"
                    onClick={() => setLightboxSrc(mainGallerySrc)}
                    className="group relative w-full cursor-zoom-in rounded-sm border border-transparent p-0 text-left transition hover:border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                    aria-label="Ver imagen ampliada"
                  >
                    <img
                      src={mainGallerySrc}
                      alt={
                        hasColorProductToggle && galleryMode === 'color'
                          ? `Muestra del color — ${variantLabelForGallery}`
                          : selectedProduct.name
                      }
                      className="block w-full max-w-[520px] sm:max-w-[600px] lg:max-w-[680px] max-h-[min(70vh,640px)] sm:max-h-[min(75vh,680px)] object-contain mx-auto"
                    />
                    <span className="pointer-events-none absolute bottom-3 right-3 rounded bg-black/55 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white opacity-0 transition group-hover:opacity-100 sm:text-xs">
                      Clic para ampliar
                    </span>
                  </button>

                  {hasMultiProductPhotos && galleryMode === 'product' ? (
                    <div className="mt-4 w-full max-w-[520px] sm:max-w-[600px] lg:max-w-[680px] mx-auto">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                        Más fotos del producto
                      </p>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {uniqueProductPhotos.map((src, i) => (
                          <button
                            key={`${src}-${i}`}
                            type="button"
                            onClick={() => setProductPhotoIndex(i)}
                            className={[
                              'flex items-center gap-2 border p-1.5 transition sm:p-2',
                              productPhotoIndex === i
                                ? 'border-orange-500 bg-white ring-1 ring-orange-500/30'
                                : 'border-gray-200 bg-white hover:border-gray-400',
                            ].join(' ')}
                            aria-label={i === 0 ? 'Vista principal' : `Foto ${i + 1}`}
                          >
                            <span className="relative h-14 w-14 shrink-0 overflow-hidden bg-white border border-gray-100">
                              <img src={src} alt="" className="h-full w-full object-cover" />
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {false ? (
                    <div className="mt-4 w-full max-w-[520px] sm:max-w-[600px] lg:max-w-[680px] mx-auto">
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <button
                          type="button"
                          onClick={() => setGalleryMode('color')}
                          className={[
                            'flex items-center gap-3 border p-2 text-left transition',
                            galleryMode === 'color'
                              ? 'border-orange-500 bg-white ring-1 ring-orange-500/30'
                              : 'border-gray-200 bg-white hover:border-gray-400',
                          ].join(' ')}
                        >
                          <span className="relative h-14 w-14 shrink-0 overflow-hidden bg-gray-100 border border-gray-100">
                            {colorSampleSrc ? (
                              <img src={colorSampleSrc} alt="" className="h-full w-full object-cover" />
                            ) : null}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-xs font-semibold text-black">Muestra del color</span>
                            <span className="block text-[11px] text-gray-500 truncate">{variantLabelForGallery}</span>
                          </span>
                        </button>
                      </div>
                    </div>
                  ) : colorSampleSrc && !productImageSrc ? (
                    <p className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-600">
                      <Palette className="h-4 w-4 shrink-0 text-orange-600" />
                      Vista: muestra del color ({variantLabelForGallery})
                    </p>
                  ) : null}
                </div>
              ) : (
                <span className="text-gray-400">Imagen del Producto</span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="border-t border-gray-200 lg:border-t-0 lg:border-l p-4 sm:p-10">
            <span className="text-xs text-gray-600 font-medium tracking-wider uppercase flex items-center gap-2">
              <span className={['w-2 h-2', theme.accent].join(' ')} />
              {categoryLabel}
            </span>

            <div className="mt-2 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <h1 className="text-2xl sm:text-4xl font-bold text-black tracking-tight sm:flex-1 min-w-0 leading-tight break-words">
                  {titleRest ? (
                    <>
                      <span className="block">{titleFirst}</span>
                      <span className="block">{titleRest}</span>
                    </>
                  ) : (
                    titleFirst
                  )}
                </h1>

                <div className="flex flex-col gap-2 w-full max-w-[240px] mx-auto sm:mx-0 sm:max-w-none sm:w-[260px] shrink-0">
                  {selectedProduct.technicalSheet ? (
                    <a
                      href={selectedProduct.technicalSheet}
                      download
                      className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 bg-white text-xs sm:text-sm font-semibold hover:border-orange-500 transition-colors"
                      aria-label="Descargar ficha técnica"
                    >
                      <Download className="w-4 h-4" />
                      Descargar ficha técnica
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 bg-gray-50 text-xs sm:text-sm font-semibold text-gray-400 cursor-not-allowed"
                    >
                      <Download className="w-4 h-4" />
                      Ficha técnica próximamente
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowCalculator(true)}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 bg-white text-xs sm:text-sm font-semibold hover:border-orange-500 hover:bg-orange-50 transition-colors"
                  >
                    <Calculator className="w-4 h-4" />
                    Calculadora de consumo
                  </button>
                </div>
              </div>
            </div>

            {/* Variantes — oculto hasta tener imágenes de cada color */}

            {!productHidesDetailDescription(selectedProduct.id) ? (
              <div className="mb-5 sm:mb-6">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedProduct.description}
                </p>
              </div>
            ) : null}

            {/* Infografía técnica */}
            {technicalSummary && (
              <section className="mb-6">
                <div className="bg-white border border-gray-200 overflow-hidden ring-1 ring-black/5">
                  <div className="h-1 w-full bg-gray-100">
                    <div className={['h-1 w-28', theme.accent].join(' ')} />
                  </div>
                  <div className="p-5">
                    <div>
                      <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Infografía</p>
                      <p className="text-lg font-semibold text-black mt-1">Datos clave del producto</p>
                    </div>
                    {technicalSummary.observaciones && (
                      <div className="mt-4 border border-gray-200 bg-gray-50 p-4">
                        <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">Observaciones</p>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{technicalSummary.observaciones}</p>
                      </div>
                    )}

                    {technicalSummary.presentacion && (
                      <div className="mt-5 border border-gray-200 bg-gray-50 p-4">
                        <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Presentación</p>
                        <p className="text-2xl sm:text-3xl font-bold text-black mt-1">{technicalSummary.presentacion}</p>
                      </div>
                    )}

                    {technicalSummary.caracteristicas && (
                      <div className="mt-5 border border-gray-200 p-4">
                        <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Características</p>
                        <p className="text-black mt-2 leading-relaxed">{technicalSummary.caracteristicas}</p>
                      </div>
                    )}

                    <ul className="mt-5 space-y-2 text-sm text-gray-700">
                      {technicalSummary.rendimiento && (
                        <li className="flex gap-2">
                          <span className={['mt-2 w-2 h-2 shrink-0', theme.accent].join(' ')} />
                          <span><span className="font-semibold text-black">Rendimiento:</span> {technicalSummary.rendimiento}</span>
                        </li>
                      )}
                      {technicalSummary.conservacion && (
                        <li className="flex gap-2">
                          <span className={['mt-2 w-2 h-2 shrink-0', theme.accent].join(' ')} />
                          <span><span className="font-semibold text-black">Conservación:</span> {technicalSummary.conservacion}</span>
                        </li>
                      )}
                      {technicalSummary.almacenaje && (
                        <li className="flex gap-2">
                          <span className={['mt-2 w-2 h-2 shrink-0', theme.accent].join(' ')} />
                          <span><span className="font-semibold text-black">Almacenaje:</span> {technicalSummary.almacenaje}</span>
                        </li>
                      )}
                    </ul>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      {technicalSummary.usos && (
                        <div className="border border-gray-200 p-4 sm:col-span-2">
                          <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Usos</p>
                          <p className="text-black mt-2 leading-relaxed">{technicalSummary.usos}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* CTA contacto */}
            <div className="mt-2 border border-gray-200 bg-gray-50 p-5">
              <p className="text-sm font-semibold text-black mb-1">¿Necesitás más información?</p>
              <p className="text-sm text-gray-600 mb-3">Descargá la ficha técnica o contactanos para asesoramiento técnico o solicitar este producto.</p>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold hover:bg-orange-500 transition-colors"
              >
                Contactar
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ConsumptionCalculatorModal
        open={showCalculator}
        onClose={() => setShowCalculator(false)}
        technicalSummary={technicalSummary}
      />

      {lightboxSrc ? (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada"
          onClick={() => setLightboxSrc(null)}
        >
          <div
            className="relative flex max-h-full max-w-full flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxSrc(null)}
              className="absolute -top-2 right-0 z-10 rounded-full bg-white/15 p-2 text-white hover:bg-white/25 sm:-top-3"
              aria-label="Cerrar vista ampliada"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={lightboxSrc}
              alt="Vista ampliada del producto"
              className="max-h-[85vh] max-w-full object-contain"
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
