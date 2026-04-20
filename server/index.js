require("dotenv").config();
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "hadiya_admin_secret_change_me";
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_TELEGRAM_ID = process.env.ADMIN_TELEGRAM_ID;

// Ensure upload and data directories exist
const uploadsDir = path.join(__dirname, "public", "uploads");
const dataDir = path.join(__dirname, "data");
[uploadsDir, dataDir].forEach((d) => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

const PRODUCTS_FILE = path.join(dataDir, "products.json");
if (!fs.existsSync(PRODUCTS_FILE)) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2));
}

function readProducts() {
  return JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf8"));
}
function writeProducts(products) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

// Multer — images only, 5 MB max
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only images are allowed"));
  },
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hadiyalab.netlify.app",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

// ── Auth middleware ───────────────────────────────────────────────────────────
function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.admin = jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ── Telegram login verification ───────────────────────────────────────────────
function verifyTelegramData(data) {
  if (!BOT_TOKEN) return false;
  const { hash, ...rest } = data;
  const checkString = Object.keys(rest)
    .sort()
    .map((k) => `${k}=${rest[k]}`)
    .join("\n");
  const secretKey = crypto.createHash("sha256").update(BOT_TOKEN).digest();
  const hmac = crypto.createHmac("sha256", secretKey).update(checkString).digest("hex");
  return hmac === hash;
}

// ── Public: order via WhatsApp ────────────────────────────────────────────────
app.post("/api/order", (req, res) => {
  const { product, name, phone } = req.body;
  if (!product || !name || !phone)
    return res.status(400).json({ error: "All fields are required" });
  const message = `🌹 New Order!\n\nProduct: ${product}\nName: ${name}\nPhone: ${phone}`;
  const number = process.env.OWNER_WHATSAPP_NUMBER;
  const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  res.json({ success: true, whatsappUrl });
});

// ── Public: get products ──────────────────────────────────────────────────────
app.get("/api/products", (req, res) => {
  res.json(readProducts());
});

// ── Admin: Telegram login ─────────────────────────────────────────────────────
app.post("/api/admin/auth/telegram", (req, res) => {
  const data = req.body;

  if (!verifyTelegramData(data)) {
    return res.status(401).json({ error: "Invalid Telegram authentication data" });
  }

  // Auth data must be fresh (< 24 h)
  if (Date.now() / 1000 - parseInt(data.auth_date) > 86400) {
    return res.status(401).json({ error: "Auth data expired" });
  }

  // Check allowed admin IDs (comma-separated list)
  if (ADMIN_TELEGRAM_ID) {
    const allowed = ADMIN_TELEGRAM_ID.split(",").map((s) => s.trim());
    if (!allowed.includes(String(data.id))) {
      return res.status(403).json({ error: "Access denied" });
    }
  }

  const token = jwt.sign(
    { id: data.id, username: data.username },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.json({
    token,
    user: { id: data.id, username: data.username, first_name: data.first_name },
  });
});

// ── Admin: products CRUD ──────────────────────────────────────────────────────
app.post("/api/admin/products", requireAdmin, upload.single("image"), (req, res) => {
  const products = readProducts();
  const { name, price, badge, note, descRu, descEn, descTr } = req.body;

  const product = {
    id: Date.now(),
    name: name || "Новый продукт",
    price: price || "",
    badge: badge || "✦",
    note: note || "",
    image: req.file ? `/uploads/${req.file.filename}` : "/hadiya_1.png",
    descKey: `custom_${Date.now()}`,
    content: {
      ru: {
        tagline: descRu || "",
        targetsLabel: "✧ Для кого",
        targets: [],
        effectsLabel: "✧ Эффект",
        effects: [],
        highlight: "",
        warning: null,
      },
      en: {
        tagline: descEn || "",
        targetsLabel: "✧ For",
        targets: [],
        effectsLabel: "✧ Effect",
        effects: [],
        highlight: "",
        warning: null,
      },
      tr: {
        tagline: descTr || "",
        targetsLabel: "✧ İçin",
        targets: [],
        effectsLabel: "✧ Etki",
        effects: [],
        highlight: "",
        warning: null,
      },
    },
  };

  products.push(product);
  writeProducts(products);
  res.status(201).json(product);
});

app.put("/api/admin/products/:id", requireAdmin, upload.single("image"), (req, res) => {
  const products = readProducts();
  const idx = products.findIndex((p) => String(p.id) === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Product not found" });

  const { name, price, badge, note, descRu, descEn, descTr } = req.body;
  const p = { ...products[idx] };

  if (name !== undefined) p.name = name;
  if (price !== undefined) p.price = price;
  if (badge !== undefined) p.badge = badge;
  if (note !== undefined) p.note = note;
  if (req.file) p.image = `/uploads/${req.file.filename}`;
  if (descRu !== undefined && p.content?.ru) p.content.ru.tagline = descRu;
  if (descEn !== undefined && p.content?.en) p.content.en.tagline = descEn;
  if (descTr !== undefined && p.content?.tr) p.content.tr.tagline = descTr;

  products[idx] = p;
  writeProducts(products);
  res.json(p);
});

app.delete("/api/admin/products/:id", requireAdmin, (req, res) => {
  const products = readProducts();
  const idx = products.findIndex((p) => String(p.id) === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Product not found" });

  const [removed] = products.splice(idx, 1);
  if (removed.image?.startsWith("/uploads/")) {
    const imgPath = path.join(__dirname, "public", removed.image);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
  }

  writeProducts(products);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
