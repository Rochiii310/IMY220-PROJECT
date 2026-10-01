import { getDb } from '../db.js'
import { toId } from '../utils.js'

const col = () => getDb().collection('posts')

export async function createPost(data) {
  const doc = { likes: [], createdAt: new Date(), ...data }
  const result = await col().insertOne(doc)
  return { ...doc, _id: result.insertedId }
}

export async function findById(id) {
  const _id = toId(id)
  return _id ? col().findOne({ _id }) : null
}

export async function findManyByIds(ids) {
  const objectIds = ids.map(toId).filter(Boolean)
  return objectIds.length
    ? col().find({ _id: { $in: objectIds } }).sort({ createdAt: -1 }).toArray()
    : []
}

export function list(filter) {
  return col().find(filter).sort({ createdAt: -1 }).limit(100).toArray()
}

export async function updatePost(id, fields) {
  await col().updateOne({ _id: toId(id) }, { $set: fields })
  return findById(id)
}

export async function deletePost(id) {
  await col().deleteOne({ _id: toId(id) })
}

export async function deleteByUser(userId) {
  const posts = await col().find({ userId }).toArray()
  await col().deleteMany({ userId })
  return posts.map((post) => String(post._id))
}

export async function toggleLike(post, userId) {
  const liked = post.likes.includes(userId)
  await col().updateOne(
    { _id: post._id },
    liked ? { $pull: { likes: userId } } : { $addToSet: { likes: userId } }
  )
  return { liked: !liked, likes: post.likes.length + (liked ? -1 : 1) }
}
