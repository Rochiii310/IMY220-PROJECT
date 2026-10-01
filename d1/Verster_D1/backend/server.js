import express from 'express'
import cors from 'cors'
import { connect } from './db.js'
import { seedIfEmpty } from './seed.js'
import { requireAuth } from './auth.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import friendRoutes from './routes/friends.js'
import postRoutes from './routes/posts.js'
import albumRoutes from './routes/albums.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.get('/', (req, res) => {
  res.json({ status: 'Shutter API running' })
})

app.use('/api', authRoutes)
app.use('/api', requireAuth, userRoutes, friendRoutes, postRoutes, albumRoutes)

app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Route not found.' })
})

app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Request is too large.' })
  }
  if (err.status && err.status < 500) {
    return res.status(err.status).json({ message: 'Bad request.' })
  }
  console.error(err)
  res.status(500).json({ message: 'Something went wrong on the server.' })
})

async function start() {
  await connect()
  await seedIfEmpty()
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })
}

start().catch((err) => {
  console.error(err)
  process.exit(1)
})
