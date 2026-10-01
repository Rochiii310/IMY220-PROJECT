import { Router } from 'express'
import * as users from '../models/users.js'
import { wrap } from '../utils.js'

const router = Router()

router.post('/friends/request/:id', wrap(async (req, res) => {
  const target = await users.findById(req.params.id)
  if (!target) return res.status(404).json({ message: 'User not found.' })
  const targetId = String(target._id)
  if (targetId === req.userId) {
    return res.status(400).json({ message: 'You cannot friend yourself.' })
  }
  if (req.user.friends.includes(targetId)) {
    return res.status(400).json({ message: 'You are already friends.' })
  }
  if (req.user.requestsSent.includes(targetId)) {
    return res.status(400).json({ message: 'Friend request already sent.' })
  }
  if (req.user.requestsReceived.includes(targetId)) {
    await users.acceptRequest(req.userId, targetId)
    return res.json({ message: 'Friend request accepted.' })
  }
  await users.sendRequest(req.userId, targetId)
  res.status(201).json({ message: 'Friend request sent.' })
}))

router.post('/friends/accept/:id', wrap(async (req, res) => {
  if (!req.user.requestsReceived.includes(req.params.id)) {
    return res.status(404).json({ message: 'No friend request from that user.' })
  }
  await users.acceptRequest(req.userId, req.params.id)
  res.json({ message: 'Friend request accepted.' })
}))

router.post('/friends/decline/:id', wrap(async (req, res) => {
  if (!req.user.requestsReceived.includes(req.params.id)) {
    return res.status(404).json({ message: 'No friend request from that user.' })
  }
  await users.cancelRequest(req.params.id, req.userId)
  res.json({ message: 'Friend request declined.' })
}))

router.delete('/friends/:id', wrap(async (req, res) => {
  if (req.user.friends.includes(req.params.id)) {
    await users.removeFriend(req.userId, req.params.id)
    return res.json({ message: 'Unfriended.' })
  }
  if (req.user.requestsSent.includes(req.params.id)) {
    await users.cancelRequest(req.userId, req.params.id)
    return res.json({ message: 'Friend request cancelled.' })
  }
  res.status(404).json({ message: 'No friendship or request found.' })
}))

export default router
