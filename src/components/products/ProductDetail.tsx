'use client'

import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Download,
  Calculator,
  X,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
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
import { detectGroupBaseName, detectVariantLabel } from './variantGrouping'
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
  const [galleryMode] = useState<'product' | 'color'>('product')
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
  const primaryProductSrc =
    uniqueProductPhotos[Math.min(productPhotoIndex, uniqueProductPhotos.length - 1)] ?? productImageSrc
  const mainGallerySrc =
    colorSampleSrc && (!productImageSrc || galleryMode === 'color')
      ? colorSampleSrc
      : primaryProductSrc || colorSampleSrc

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

        {/* Fila superior: imagen | info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-start">
          {/* Imagen */}
          <div className="bg-gray-50 p-6 sm:p-10 flex items-start justify-center">
            {mainGallerySrc ? (
              <button
                type="button"
                onClick={() => setLightboxSrc(mainGallerySrc)}
                className="group relative w-full cursor-zoom-in rounded-sm border border-transparent p-0 text-left transition hover:border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                aria-label="Ver imagen ampliada"
              >
                <Image
                  src={mainGallerySrc}
                  alt={selectedProduct.name}
                  width={480}
                  height={520}
                  className="block w-full max-w-[480px] max-h-[520px] object-contain mx-auto"
                  priority
                />
                <span className="pointer-events-none absolute bottom-3 right-3 rounded bg-black/55 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white opacity-0 transition group-hover:opacity-100 sm:text-xs">
                  Clic para ampliar
                </span>
              </button>
            ) : (
              <span className="text-gray-400">Imagen del Producto</span>
            )}
          </div>

          {/* Info superior: título, botones, descripción, observaciones, presentación, características */}
          <div className="border-t border-gray-200 lg:border-t-0 lg:border-l p-5 sm:p-8">
            <span className="text-xs text-gray-600 font-medium tracking-wider uppercase flex items-center gap-2">
              <span className={['w-2 h-2', theme.accent].join(' ')} />
              {categoryLabel}
            </span>

            <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight leading-tight break-words mt-2 mb-4">
              {selectedProduct.name}
            </h1>

            <div className="flex flex-col gap-2 mb-5">
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
                <button type="button" disabled className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 bg-gray-50 text-xs sm:text-sm font-semibold text-gray-400 cursor-not-allowed">
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

            {!productHidesDetailDescription(selectedProduct.id) && (
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-5">
                {selectedProduct.description}
              </p>
            )}

            {technicalSummary?.observaciones && (
              <div className="mb-4 border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">Observaciones</p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{technicalSummary.observaciones}</p>
              </div>
            )}

            {technicalSummary?.presentacion && (
              <div className="mb-4 border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Presentación</p>
                <p className="text-2xl sm:text-3xl font-bold text-black mt-1">{technicalSummary.presentacion}</p>
              </div>
            )}

            {technicalSummary?.caracteristicas && (
              <div className="border border-gray-200 p-4">
                <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Características</p>
                <p className="text-black mt-2 leading-relaxed text-sm">{technicalSummary.caracteristicas}</p>
              </div>
            )}
          </div>
        </div>

        {/* Fila inferior: ancho completo */}
        {technicalSummary && (
          <div className="border-t border-gray-200 p-5 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-4">
              {technicalSummary.rendimiento && (
                <div className="border border-gray-200 p-4">
                  <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-1">Rendimiento</p>
                  <p className="text-black leading-relaxed">{technicalSummary.rendimiento}</p>
                </div>
              )}
              {technicalSummary.conservacion && (
                <div className="border border-gray-200 p-4">
                  <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-1">Conservación</p>
                  <p className="text-black leading-relaxed">{technicalSummary.conservacion}</p>
                </div>
              )}
              {technicalSummary.almacenaje && (
                <div className="border border-gray-200 p-4">
                  <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-1">Almacenaje</p>
                  <p className="text-black leading-relaxed">{technicalSummary.almacenaje}</p>
                </div>
              )}
            </div>

            {technicalSummary.usos && (
              <div className="border border-gray-200 p-4 mb-4 text-sm">
                <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Usos</p>
                <p className="text-black mt-2 leading-relaxed">{technicalSummary.usos}</p>
              </div>
            )}

            <div className="border border-gray-200 bg-gray-50 p-5">
              <p className="text-sm font-semibold text-black mb-1">¿Necesitás más información?</p>
              <p className="text-sm text-gray-600 mb-3">Descargá la ficha técnica o contactanos para asesoramiento técnico o solicitar este producto.</p>
              <Link href="/contacto" className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold hover:bg-orange-500 transition-colors">
                Contactar
              </Link>
            </div>
          </div>
        )}
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
