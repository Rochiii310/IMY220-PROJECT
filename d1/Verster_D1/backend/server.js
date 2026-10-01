import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.post('/api/signin', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }

  res.json({
    message: 'Signed in successfully.',
    user: {
      id: 'u1',
      name: 'Test User',
      username: '@testuser',
      email
    },
    token: 'dummy-token-123'
  })
})

app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required.' })
  }

  res.status(201).json({
    message: 'Account created successfully.',
    user: {
      id: 'u99',
      name,
      username: `@${name.toLowerCase().replace(/\s+/g, '')}`,
      email
    },
    token: 'dummy-token-456'
  })
})

app.get('/', (req, res) => {
  res.json({ status: 'Shutter API running' })
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
