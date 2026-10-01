import { Router } from 'express'
import * as users from '../models/users.js'
import * as posts from '../models/posts.js'
import * as comments from '../models/comments.js'
import * as albums from '../models/albums.js'
import * as reports from '../models/reports.js'
import { wrap, summary, selfView } from '../utils.js'

const router = Router()
const emailPattern = /^\S+@\S+\.\S+$/

function friendStatus(viewer, target) {
  const targetId = String(target._id)
  if (targetId === String(viewer._id)) return 'self'
  if (viewer.friends.includes(targetId)) return 'friends'
  if (viewer.requestsSent.includes(targetId)) return 'sent'
  if (viewer.requestsReceived.includes(targetId)) return 'received'
  return 'none'
}

router.get('/users', wrap(async (req, res) => {
  const term = String(req.query.search || '').trim()
  const found = term ? await users.search(term) : await users.listAll()
  res.json(found.map(summary))
}))

router.get('/users/:id', wrap(async (req, res) => {
  const user = await users.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found.' })
  const isSelf = String(user._id) === req.userId
  const friends = await users.findMany(user.friends)
  const profile = { ...summary(user), bio: user.bio, friends: friends.map(summary), friendStatus: friendStatus(req.user, user) }
  if (isSelf) {
    profile.email = user.email
    profile.requests = (await users.findMany(user.requestsReceived)).map(summary)
  }
  res.json(profile)
}))

router.put('/users/:id', wrap(async (req, res) => {
  if (req.params.id !== req.userId) {
    return res.status(403).json({ message: 'You can only edit your own profile.' })
  }
  const { name, email, bio, avatar } = req.body
  const fields = {}
  if (name !== undefined) {
    if (!String(name).trim()) return res.status(400).json({ message: 'Name is required.' })
    fields.name = String(name).trim()
  }
  if (email !== undefined) {
    if (!emailPattern.test(email)) return res.status(400).json({ message: 'Enter a valid email address.' })
    const existing = await users.findByEmail(email)
    if (existing && String(existing._id) !== req.userId) {
      return res.status(409).json({ message: 'That email is already in use.' })
    }
    fields.email = email.toLowerCase()
  }
  if (bio !== undefined) fields.bio = String(bio)
  if (avatar !== undefined && String(avatar).trim()) fields.avatar = String(avatar).trim()
  const updated = await users.updateUser(req.userId, fields)
  res.json(selfView(updated))
}))

router.delete('/users/:id', wrap(async (req, res) => {
  if (req.params.id !== req.userId) {
    return res.status(403).json({ message: 'You can only delete your own account.' })
  }
  const postIds = await posts.deleteByUser(req.userId)
  await comments.deleteByPosts(postIds)
  await comments.deleteByUser(req.userId)
  await albums.removePostsFromAll(postIds)
  await albums.deleteByUser(req.userId)
  await reports.deleteByPosts(postIds)
  await users.deleteUser(req.userId)
  res.json({ message: 'Account deleted.' })
}))

export default router
