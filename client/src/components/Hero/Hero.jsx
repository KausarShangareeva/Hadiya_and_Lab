import styles from "./Hero.module.css";

export default function Hero({ onOrder }) {
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
            <span>✦</span> Shangareeva Lab
          </div>
          <div className={styles.floatTag}>Натуральный состав</div>
        </div>

        {/* Right — copy */}
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Уход за кожей нового поколения</p>
          <h1 className={styles.heading}>
            Маски,
            <br />
            <em>после которых</em>
            <br />
            не нужен крем
          </h1>
          <p className={styles.desc}>
            Профессиональная косметика на растительной основе. Глубокое
            увлажнение, детокс и сияние — в одном ритуале.
          </p>
          <div className={styles.cta}>
            <button className={styles.btnSecondary} onClick={onOrder}>
              Смотреть продукты
            </button>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>3+</span>
              <span className={styles.statLabel}>Маски</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>100%</span>
              <span className={styles.statLabel}>Натурально</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>500+</span>
              <span className={styles.statLabel}>Клиентов</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
