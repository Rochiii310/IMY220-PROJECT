import { Router } from 'express'
import * as users from '../models/users.js'
import { hashPassword, verifyPassword, signToken, requireAuth } from '../auth.js'
import { wrap, selfView } from '../utils.js'

const router = Router()
const emailPattern = /^\S+@\S+\.\S+$/

router.post('/signup', wrap(async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !name.trim() || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required.' })
  }
  if (!emailPattern.test(email)) {
    return res.status(400).json({ message: 'Enter a valid email address.' })
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' })
  }
  if (await users.findByEmail(email)) {
    return res.status(409).json({ message: 'An account with that email already exists.' })
  }
  const username = await users.uniqueUsername(name)
  const user = await users.createUser({
    name: name.trim(),
    username,
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(username)}`
  })
  res.status(201).json({
    message: 'Account created successfully.',
    user: selfView(user),
    token: signToken(String(user._id))
  })
}))

router.post('/signin', wrap(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }
  const user = await users.findByEmail(email)
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ message: 'Invalid email or password.' })
  }
  res.json({
    message: 'Signed in successfully.',
    user: selfView(user),
    token: signToken(String(user._id))
  })
}))

router.post('/logout', requireAuth, (req, res) => {
  res.json({ message: 'Logged out.' })
})

router.get('/me', requireAuth, (req, res) => {
  res.json(selfView(req.user))
})

export default router
