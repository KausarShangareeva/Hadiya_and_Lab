import { useState, useEffect, useRef } from "react";
import styles from "./AdminPage.module.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
const BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "";

// ── Telegram Login Widget ─────────────────────────────────────────────────────
function TelegramLoginButton({ onAuth }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!BOT_USERNAME) return;

    window.__onTelegramAuth = function (user) {
      onAuth(user);
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", BOT_USERNAME);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "__onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    script.async = true;
    ref.current?.appendChild(script);

    return () => {
      delete window.__onTelegramAuth;
    };
  }, [onAuth]);

  if (!BOT_USERNAME) {
    return (
      <div className={styles.envWarning}>
        Укажите <code>VITE_TELEGRAM_BOT_USERNAME</code> в <code>.env</code> файле клиента.
      </div>
    );
  }

  return <div ref={ref} className={styles.tgWidget} />;
}

// ── Product Form Modal ────────────────────────────────────────────────────────
function ProductFormModal({ product, token, onSave, onClose }) {
  const isEdit = Boolean(product);
  const [form, setForm] = useState({
    name: product?.name || "",
    price: product?.price || "",
    badge: product?.badge || "✦",
    note: product?.note || "",
    descRu: product?.content?.ru?.tagline || "",
    descEn: product?.content?.en?.tagline || "",
    descTr: product?.content?.tr?.tagline || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(product?.image || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);

      const url = isEdit
        ? `${API}/api/admin/products/${product.id}`
        : `${API}/api/admin/products`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) throw new Error((await res.json()).error || "Ошибка");
      const saved = await res.json();
      onSave(saved, isEdit);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>
          {isEdit ? "Редактировать товар" : "Добавить товар"}
        </h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Image */}
          <div className={styles.imageUpload}>
            {preview && (
              <img
                src={preview.startsWith("/uploads") ? `${API}${preview}` : preview}
                alt="preview"
                className={styles.imagePreview}
              />
            )}
            <label className={styles.uploadLabel}>
              {preview ? "Заменить фото" : "Загрузить фото"}
              <input type="file" accept="image/*" onChange={handleImage} hidden />
            </label>
          </div>

          <div className={styles.row}>
            <label>
              Название
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Цена
              <input name="price" value={form.price} onChange={handleChange} placeholder="2 900 ₽" />
            </label>
          </div>

          <div className={styles.row}>
            <label>
              Иконка (emoji)
              <input name="badge" value={form.badge} onChange={handleChange} maxLength={4} />
            </label>
            <label>
              Подпись (note)
              <input name="note" value={form.note} onChange={handleChange} placeholder="Powder-to-cream mask" />
            </label>
          </div>

          <label>
            Описание (RU)
            <textarea name="descRu" value={form.descRu} onChange={handleChange} rows={2} />
          </label>
          <label>
            Описание (EN)
            <textarea name="descEn" value={form.descEn} onChange={handleChange} rows={2} />
          </label>
          <label>
            Описание (TR)
            <textarea name="descTr" value={form.descTr} onChange={handleChange} rows={2} />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.formActions}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className={styles.btnSave} disabled={loading}>
              {loading ? "Сохраняю..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem("admin_token"));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("admin_user")); } catch { return null; }
  });
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [authError, setAuthError] = useState("");

  async function handleTelegramAuth(tgUser) {
    setAuthError("");
    try {
      const res = await fetch(`${API}/api/admin/auth/telegram`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tgUser),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка входа");
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      setAuthError(err.message);
    }
  }

  function logout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setToken(null);
    setUser(null);
  }

  async function loadProducts() {
    setLoadingProducts(true);
    try {
      const res = await fetch(`${API}/api/products`);
      setProducts(await res.json());
    } catch {
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }

  useEffect(() => {
    if (token) loadProducts();
  }, [token]);

  async function handleDelete(id) {
    try {
      await fetch(`${API}/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {}
    setDeleteConfirm(null);
  }

  function handleSave(saved, isEdit) {
    setProducts((prev) =>
      isEdit ? prev.map((p) => (p.id === saved.id ? saved : p)) : [...prev, saved]
    );
    setEditProduct(null);
    setShowAdd(false);
  }

  // ── Login screen ─────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginCard}>
          <div className={styles.loginLogo}>✦ Hadiya&amp;Lab</div>
          <h1 className={styles.loginTitle}>Панель администратора</h1>
          <p className={styles.loginSub}>Войдите через Telegram для управления товарами</p>
          <TelegramLoginButton onAuth={handleTelegramAuth} />
          {authError && <p className={styles.error}>{authError}</p>}
        </div>
      </div>
    );
  }

  // ── Admin panel ───────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLogo}>✦ Hadiya&amp;Lab — Админ</div>
        <div className={styles.headerUser}>
          <span>@{user?.username || user?.first_name}</span>
          <button className={styles.btnLogout} onClick={logout}>Выйти</button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.toolbar}>
          <h2 className={styles.sectionTitle}>Товары ({products.length})</h2>
          <button className={styles.btnAdd} onClick={() => setShowAdd(true)}>
            + Добавить товар
          </button>
        </div>

        {loadingProducts ? (
          <p className={styles.hint}>Загрузка...</p>
        ) : products.length === 0 ? (
          <p className={styles.hint}>Товаров ещё нет. Добавьте первый!</p>
        ) : (
          <div className={styles.grid}>
            {products.map((p) => (
              <div key={p.id} className={styles.card}>
                <img
                  src={p.image?.startsWith("/uploads") ? `${API}${p.image}` : p.image}
                  alt={p.name}
                  className={styles.cardImg}
                />
                <div className={styles.cardBody}>
                  <span className={styles.cardBadge}>{p.badge}</span>
                  <h3 className={styles.cardName}>{p.name}</h3>
                  <p className={styles.cardPrice}>{p.price}</p>
                  <p className={styles.cardNote}>{p.note}</p>
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.btnEdit} onClick={() => setEditProduct(p)}>
                    Изменить
                  </button>
                  <button className={styles.btnDelete} onClick={() => setDeleteConfirm(p.id)}>
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add / Edit modal */}
      {(showAdd || editProduct) && (
        <ProductFormModal
          product={editProduct || null}
          token={token}
          onSave={handleSave}
          onClose={() => { setShowAdd(false); setEditProduct(null); }}
        />
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className={styles.overlay} onClick={() => setDeleteConfirm(null)}>
          <div className={styles.confirmDialog} onClick={(e) => e.stopPropagation()}>
            <p>Удалить этот товар? Это действие необратимо.</p>
            <div className={styles.formActions}>
              <button className={styles.btnCancel} onClick={() => setDeleteConfirm(null)}>
                Отмена
              </button>
              <button className={styles.btnDelete} onClick={() => handleDelete(deleteConfirm)}>
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
