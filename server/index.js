require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://shangareevalab.netlify.app',
  ],
  methods: ['GET', 'POST'],
}))
app.use(express.json())

function buildMessage({ product, name, phone }) {
  return `🛍 New Order!\n\nProduct: ${product}\nName: ${name}\nPhone: ${phone}`
}

app.post('/api/order', async (req, res) => {
  const { product, name, phone } = req.body

  if (!product || !name || !phone) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  const message = buildMessage({ product, name, phone })
  const number = process.env.OWNER_WHATSAPP_NUMBER
  const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(message)}`

  return res.json({ success: true, whatsappUrl })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
