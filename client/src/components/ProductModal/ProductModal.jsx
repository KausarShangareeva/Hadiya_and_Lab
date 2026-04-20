import { useEffect, useState } from 'react'
import styles from './ProductModal.module.css'
import { useLanguage } from '../../i18n/LanguageContext'

export default function ProductModal({ product, onClose, onOrder }) {
  const { lang: globalLang, t } = useLanguage()
  const [lang, setLang] = useState(globalLang)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!product) return
    setLang(globalLang)
    const id = requestAnimationFrame(() => setVisible(true))
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('keydown', onKey)
    }
  }, [product])

  useEffect(() => {
    setLang(globalLang)
  }, [globalLang])

  function handleClose() {
    setVisible(false)
    document.body.style.overflow = ''
    setTimeout(onClose, 300)
  }

  if (!product) return null

  const c = product.content[lang] || product.content.ru
  const isRTL = lang === 'ar'

  function handleOrder() {
    onOrder(product.name)
    handleClose()
  }

  return (
    <div
      className={`${styles.backdrop} ${visible ? styles.backdropVisible : ''}`}
      onClick={handleClose}
    >
      <div
        className={`${styles.modal} ${visible ? styles.modalVisible : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <button className={styles.close} onClick={handleClose} aria-label={t.modal.close}>✕</button>

        <div className={styles.layout}>
          {/* Image column */}
          <div className={styles.imgCol}>
            <div className={styles.imgWrap}>
              <img src={product.image} alt={product.name} className={styles.img} />
            </div>
            <div className={styles.imgMeta}>
              <span className={styles.bigBadge}>{product.badge}</span>
              <span className={styles.netWeight}>Net 50 g</span>
            </div>
          </div>

          {/* Content column */}
          <div className={styles.content} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className={styles.topRow}>
              <p className={styles.brand}>Hadiya&amp;Lab</p>
              <p className={styles.priceTag}>{product.price}</p>
            </div>

            <h2 className={styles.name}>{product.name}</h2>
            <p className={styles.tagline}>{c.tagline}</p>

            {/* Language tabs */}
            <div className={styles.tabs}>
              {['ru', 'en', 'tr', 'ar'].map(l => (
                <button
                  key={l}
                  className={`${styles.tab} ${lang === l ? styles.tabActive : ''}`}
                  onClick={() => setLang(l)}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <div className={styles.sections}>
              {/* Targets */}
              <div className={styles.section}>
                <p className={styles.secLabel}>{c.targetsLabel}</p>
                <div className={styles.pills}>
                  {c.targets.map(target => (
                    <span key={target} className={styles.pill}>{target}</span>
                  ))}
                </div>
              </div>

              {/* Effects */}
              <div className={styles.section}>
                <p className={styles.secLabel}>{c.effectsLabel}</p>
                <div className={styles.pills}>
                  {c.effects.map(ef => (
                    <span key={ef} className={`${styles.pill} ${styles.pillEffect}`}>{ef}</span>
                  ))}
                </div>
              </div>

              {/* Highlight */}
              {c.highlight && (
                <div className={styles.highlight}>
                  <p>{c.highlight}</p>
                </div>
              )}

              {/* Warning */}
              {c.warning && (
                <div className={styles.warnBox}>
                  <span className={styles.warnIcon}>⚠️</span>
                  <p>{c.warning}</p>
                </div>
              )}
            </div>

            <p className={styles.note}>{product.note}</p>

            <button className={styles.btnOrder} onClick={handleOrder}>
              {t.modal.order} {product.price}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
