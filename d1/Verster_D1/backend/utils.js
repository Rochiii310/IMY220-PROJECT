import { ObjectId } from 'mongodb'

export function toId(id) {
  return /^[a-f0-9]{24}$/i.test(String(id)) ? new ObjectId(String(id)) : null
}

export function wrap(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next)
}

export function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function normalizeTags(tags) {
  const list = Array.isArray(tags) ? tags : String(tags || '').split(/[\s,]+/)
  const cleaned = list
    .map((tag) => String(tag).trim().toLowerCase().replace(/^#+/, ''))
    .filter(Boolean)
    .map((tag) => `#${tag}`)
  return [...new Set(cleaned)]
}

export function summary(user) {
  if (!user) return null
  return {
    id: String(user._id),
    name: user.name,
    username: user.username,
    avatar: user.avatar,
    verified: Boolean(user.verified)
  }
}

export function selfView(user) {
  return {
    id: String(user._id),
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    avatar: user.avatar,
    verified: Boolean(user.verified),
    role: user.role
  }
}
