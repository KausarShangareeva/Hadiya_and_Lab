import { useState, useEffect, useRef } from "react";
import styles from "./Header.module.css";
import { useLanguage, LANGUAGES } from "../../i18n/LanguageContext";

export default function Header() {
  const { lang, setLang, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  const NAV_LINKS = [
    { label: t.nav.home, id: "hero" },
    { label: t.nav.products, id: "products" },
    { label: t.nav.about, id: "about" },
    { label: t.nav.contacts, id: "order-form" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onClickOutside(e) {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }

  function selectLang(code) {
    setLang(code);
    setLangOpen(false);
  }

  const current = LANGUAGES.find((l) => l.code === lang);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <a href="#" className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          <span className={styles.logoText}>
            Hadiya<span className={styles.logoAccent}>&amp;Lab</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className={styles.nav}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href="#"
              className={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(link.id);
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Language switcher */}
        <div className={styles.langSwitcher} ref={langRef}>
          <button
            className={styles.langBtn}
            onClick={() => setLangOpen(!langOpen)}
            aria-label="Language"
          >
            <span className={styles.langFlag}><current.Flag size={20} /></span>
            <span className={styles.langCode}>{current.label}</span>
            <span className={`${styles.langArrow} ${langOpen ? styles.langArrowOpen : ""}`}>▾</span>
          </button>

          {langOpen && (
            <div className={styles.langDropdown}>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  className={`${styles.langOption} ${lang === l.code ? styles.langOptionActive : ""}`}
                  onClick={() => selectLang(l.code)}
                >
                  <span className={styles.langFlag}><l.Flag size={20} /></span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Burger */}
        <button
          className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ""}`}
          aria-label="Меню"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.id}
            href="#"
            className={styles.mobileLink}
            onClick={(e) => {
              e.preventDefault();
              scrollTo(link.id);
            }}
          >
            {link.label}
          </a>
        ))}

        {/* Mobile language options */}
        <div className={styles.mobileLangRow}>
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              className={`${styles.mobileLangBtn} ${lang === l.code ? styles.mobileLangBtnActive : ""}`}
              onClick={() => { setLang(l.code); setMenuOpen(false); }}
            >
              <l.Flag size={20} />
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
