import styles from "./Footer.module.css";
import { useLanguage } from "../../i18n/LanguageContext";

const LINK_HREFS = ["#products", "#reviews", "#order-form", "#about"];

export default function Footer() {
  const { t } = useLanguage();
  const f = t.footer;
  const year = new Date().getFullYear();

  function scrollTo(id) {
    const el = document.getElementById(id.replace("#", ""));
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>✦</span>
              <span>
                Hadiya<span className={styles.logoAccent}>&amp;Lab</span>
              </span>
            </div>
            <p className={styles.tagline}>{f.tagline}</p>
            <div className={styles.socials}>
              {/* WhatsApp */}
              <a href="https://wa.me/46728448929" target="_blank" rel="noreferrer" className={styles.social} aria-label="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.556 4.113 1.528 5.843L0 24l6.335-1.652A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.848 0-3.576-.5-5.065-1.374l-.363-.215-3.761.98 1.012-3.648-.236-.376A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
              </a>
              {/* Telegram */}
              <a href="https://t.me/+46728448929" target="_blank" rel="noreferrer" className={styles.social} aria-label="Telegram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Nav */}
          <div className={styles.navBlock}>
            <p className={styles.navTitle}>{f.navTitle}</p>
            <ul className={styles.navList}>
              {f.links.map((label, i) => (
                <li key={i}>
                  <a
                    href={LINK_HREFS[i]}
                    className={styles.navLink}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(LINK_HREFS[i]);
                    }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.navBlock}>
            <p className={styles.navTitle}>{f.contactsTitle}</p>
            <ul className={styles.navList}>
              <li>
                <a href="https://wa.me/46728448929" target="_blank" rel="noreferrer" className={styles.navLink}>
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="https://t.me/+46728448929" target="_blank" rel="noreferrer" className={styles.navLink}>
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>© {year} Hadiya&amp;Lab. {f.copyright}</p>
          <p className={styles.copy}>{f.tagline2}</p>
        </div>
      </div>
    </footer>
  );
}
