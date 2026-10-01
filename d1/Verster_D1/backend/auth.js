import crypto from 'crypto'
import * as users from './models/users.js'

const SECRET = process.env.JWT_SECRET || 'shutter-dev-secret'
const WEEK = 7 * 24 * 60 * 60 * 1000

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':')
  const attempt = crypto.scryptSync(password, salt, 64)
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), attempt)
}

function sign(payload) {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('base64url')
}

export function signToken(userId) {
  const payload = Buffer.from(JSON.stringify({ id: userId, exp: Date.now() + WEEK })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export function verifyToken(token) {
  const [payload, signature] = String(token).split('.')
  if (!payload || !signature) return null
  const expected = sign(payload)
  if (signature.length !== expected.length) return null
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null
  const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
  return data.exp > Date.now() ? data : null
}

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const data = header.startsWith('Bearer ') ? verifyToken(header.slice(7)) : null
    const user = data ? await users.findById(data.id) : null
    if (!user) return res.status(401).json({ message: 'Please log in.' })
    req.user = user
    req.userId = String(user._id)
    next()
  } catch {
    res.status(401).json({ message: 'Please log in.' })
  }
}
