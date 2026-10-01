import { Router } from 'express'
import * as posts from '../models/posts.js'
import * as comments from '../models/comments.js'
import * as albums from '../models/albums.js'
import * as reports from '../models/reports.js'
import { presentPosts, presentComments } from '../presenters.js'
import { wrap, normalizeTags, escapeRegex } from '../utils.js'

const router = Router()

router.get('/posts', wrap(async (req, res) => {
  const { feed, userId, search } = req.query
  const filter = {}
  if (userId) filter.userId = String(userId)
  if (feed === 'local') {
    filter.userId = { $in: [req.userId, ...req.user.friends] }
  }
  if (search && String(search).trim()) {
    const rx = new RegExp(escapeRegex(String(search).trim()), 'i')
    filter.$or = [{ description: rx }, { hashtags: rx }]
  }
  const found = await posts.list(filter)
  res.json(await presentPosts(found, req.userId))
}))

router.get('/posts/:id', wrap(async (req, res) => {
  const post = await posts.findById(req.params.id)
  if (!post) return res.status(404).json({ message: 'Post not found.' })
  const [presented] = await presentPosts([post], req.userId)
  const list = await comments.listByPost(String(post._id))
  res.json({ ...presented, comments: await presentComments(list) })
}))

router.post('/posts', wrap(async (req, res) => {
  const { description, image, hashtags } = req.body
  if (!description || description.trim().length < 5) {
    return res.status(400).json({ message: 'Description must be at least 5 characters.' })
  }
  if (!image) {
    return res.status(400).json({ message: 'An image is required.' })
  }
  const post = await posts.createPost({
    userId: req.userId,
    description: description.trim(),
    image,
    hashtags: normalizeTags(hashtags)
  })
  const [presented] = await presentPosts([post], req.userId)
  res.status(201).json(presented)
}))

router.put('/posts/:id', wrap(async (req, res) => {
  const post = await posts.findById(req.params.id)
  if (!post) return res.status(404).json({ message: 'Post not found.' })
  if (post.userId !== req.userId) {
    return res.status(403).json({ message: 'You can only edit your own posts.' })
  }
  const fields = {}
  if (req.body.description !== undefined) {
    if (String(req.body.description).trim().length < 5) {
      return res.status(400).json({ message: 'Description must be at least 5 characters.' })
    }
    fields.description = String(req.body.description).trim()
  }
  if (req.body.hashtags !== undefined) fields.hashtags = normalizeTags(req.body.hashtags)
  const updated = await posts.updatePost(req.params.id, fields)
  const [presented] = await presentPosts([updated], req.userId)
  res.json(presented)
}))

router.delete('/posts/:id', wrap(async (req, res) => {
  const post = await posts.findById(req.params.id)
  if (!post) return res.status(404).json({ message: 'Post not found.' })
  if (post.userId !== req.userId) {
    return res.status(403).json({ message: 'You can only delete your own posts.' })
  }
  const postId = String(post._id)
  await posts.deletePost(postId)
  await comments.deleteByPost(postId)
  await albums.removePostFromAll(postId)
  await reports.deleteByPost(postId)
  res.json({ message: 'Post deleted.' })
}))

router.post('/posts/:id/like', wrap(async (req, res) => {
  const post = await posts.findById(req.params.id)
  if (!post) return res.status(404).json({ message: 'Post not found.' })
  res.json(await posts.toggleLike(post, req.userId))
}))

router.post('/posts/:id/comments', wrap(async (req, res) => {
  const post = await posts.findById(req.params.id)
  if (!post) return res.status(404).json({ message: 'Post not found.' })
  const text = String(req.body.text || '').trim()
  if (!text) return res.status(400).json({ message: 'Comment cannot be empty.' })
  const comment = await comments.addComment({ postId: String(post._id), userId: req.userId, text })
  const [presented] = await presentComments([comment])
  res.status(201).json(presented)
}))

router.delete('/posts/:id/comments/:commentId', wrap(async (req, res) => {
  const post = await posts.findById(req.params.id)
  const comment = await comments.findById(req.params.commentId)
  if (!post || !comment || comment.postId !== String(post._id)) {
    return res.status(404).json({ message: 'Comment not found.' })
  }
  if (comment.userId !== req.userId && post.userId !== req.userId) {
    return res.status(403).json({ message: 'You cannot delete this comment.' })
  }
  await comments.removeComment(req.params.commentId)
  res.json({ message: 'Comment deleted.' })
}))

router.post('/posts/:id/report', wrap(async (req, res) => {
  const post = await posts.findById(req.params.id)
  if (!post) return res.status(404).json({ message: 'Post not found.' })
  const reasons = await reports.listReasons()
  if (!reasons.includes(req.body.reason)) {
    return res.status(400).json({ message: 'Please choose a valid reason.' })
  }
  if (await reports.findReport(String(post._id), req.userId)) {
    return res.status(409).json({ message: 'You have already reported this post.' })
  }
  await reports.createReport({ postId: String(post._id), userId: req.userId, reason: req.body.reason })
  res.status(201).json({ message: 'Report submitted.' })
}))

router.get('/reasons', wrap(async (req, res) => {
  res.json(await reports.listReasons())
}))

export default router
