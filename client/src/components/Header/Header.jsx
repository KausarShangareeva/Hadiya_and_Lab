import { useState, useEffect } from "react";
import styles from "./Header.module.css";

const NAV_LINKS = ["Главная", "Продукты", "О нас", "Контакты"];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <a href="#" className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          <span className={styles.logoText}>
            Shangareeva<span className={styles.logoAccent}> Lab</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className={styles.nav}>
          {NAV_LINKS.map((link, i) => (
            <a
              key={link}
              href="#"
              className={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                const ids = ["hero", "products", "about", "order-form"];
                scrollTo(ids[i]);
              }}
            >
              {link}
            </a>
          ))}
        </nav>

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
        {NAV_LINKS.map((link, i) => (
          <a
            key={link}
            href="#"
            className={styles.mobileLink}
            onClick={(e) => {
              e.preventDefault();
              const ids = ["hero", "products", "about", "order-form"];
              scrollTo(ids[i]);
            }}
          >
            {link}
          </a>
        ))}
      </div>
    </header>
  );
}
