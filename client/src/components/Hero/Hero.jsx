import styles from "./Hero.module.css";
import { useLanguage } from "../../i18n/LanguageContext";

export default function Hero({ onOrder }) {
  const { t } = useLanguage();
  const h = t.hero;

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.inner}>
        {/* Left — image */}
        <div className={styles.imageWrap}>
          <div className={styles.imageBubble}>
            <img
              src="/hadiya_4.png"
              alt="Hydra Calm Mask"
              className={styles.image}
            />
          </div>
          <div className={styles.badge}>
            <span>✦</span> Hadiya&amp;Lab
          </div>
          <div className={styles.floatTag}>{h.floatTag}</div>
        </div>

        {/* Right — copy */}
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{h.eyebrow}</p>
          <h1 className={styles.heading}>
            {h.heading1}
            <br />
            <em>{h.heading2}</em>
            <br />
            {h.heading3}
          </h1>
          <p className={styles.desc}>{h.desc}</p>
          <div className={styles.cta}>
            <button className={styles.btnSecondary} onClick={onOrder}>
              {h.btnViewProducts}
            </button>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>3+</span>
              <span className={styles.statLabel}>{h.statMasks}</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>100%</span>
              <span className={styles.statLabel}>{h.statNatural}</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>500+</span>
              <span className={styles.statLabel}>{h.statClients}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
