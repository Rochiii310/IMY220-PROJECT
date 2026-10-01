import { Router } from 'express'
import * as albums from '../models/albums.js'
import * as posts from '../models/posts.js'
import { presentAlbums, presentPosts } from '../presenters.js'
import { wrap, normalizeTags } from '../utils.js'

const router = Router()

async function loadOwnedAlbum(req, res) {
  const album = await albums.findById(req.params.id)
  if (!album) {
    res.status(404).json({ message: 'Album not found.' })
    return null
  }
  if (album.userId !== req.userId) {
    res.status(403).json({ message: 'You can only change your own albums.' })
    return null
  }
  return album
}

router.get('/albums', wrap(async (req, res) => {
  const filter = req.query.userId ? { userId: String(req.query.userId) } : {}
  res.json(await presentAlbums(await albums.list(filter)))
}))

router.get('/albums/:id', wrap(async (req, res) => {
  const album = await albums.findById(req.params.id)
  if (!album) return res.status(404).json({ message: 'Album not found.' })
  const [presented] = await presentAlbums([album])
  const albumPosts = await posts.findManyByIds(album.postIds)
  res.json({ ...presented, posts: await presentPosts(albumPosts, req.userId) })
}))

router.post('/albums', wrap(async (req, res) => {
  const { name, description, hashtags } = req.body
  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Album name is required.' })
  }
  const album = await albums.createAlbum({
    userId: req.userId,
    name: name.trim(),
    description: String(description || '').trim(),
    hashtags: normalizeTags(hashtags)
  })
  const [presented] = await presentAlbums([album])
  res.status(201).json(presented)
}))

router.put('/albums/:id', wrap(async (req, res) => {
  const album = await loadOwnedAlbum(req, res)
  if (!album) return
  const fields = {}
  if (req.body.name !== undefined) {
    if (!String(req.body.name).trim()) {
      return res.status(400).json({ message: 'Album name is required.' })
    }
    fields.name = String(req.body.name).trim()
  }
  if (req.body.description !== undefined) fields.description = String(req.body.description).trim()
  if (req.body.hashtags !== undefined) fields.hashtags = normalizeTags(req.body.hashtags)
  const updated = await albums.updateAlbum(req.params.id, fields)
  const [presented] = await presentAlbums([updated])
  res.json(presented)
}))

router.delete('/albums/:id', wrap(async (req, res) => {
  const album = await loadOwnedAlbum(req, res)
  if (!album) return
  await albums.deleteAlbum(req.params.id)
  res.json({ message: 'Album deleted.' })
}))

router.post('/albums/:id/posts/:postId', wrap(async (req, res) => {
  const album = await loadOwnedAlbum(req, res)
  if (!album) return
  const post = await posts.findById(req.params.postId)
  if (!post) return res.status(404).json({ message: 'Post not found.' })
  const updated = await albums.addPost(req.params.id, String(post._id))
  const [presented] = await presentAlbums([updated])
  res.json(presented)
}))

router.delete('/albums/:id/posts/:postId', wrap(async (req, res) => {
  const album = await loadOwnedAlbum(req, res)
  if (!album) return
  const updated = await albums.removePost(req.params.id, req.params.postId)
  const [presented] = await presentAlbums([updated])
  res.json(presented)
}))

export default router
