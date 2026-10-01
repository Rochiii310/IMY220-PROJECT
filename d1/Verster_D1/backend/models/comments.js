import { getDb } from '../db.js'
import { toId } from '../utils.js'

const col = () => getDb().collection('comments')

export async function addComment(data) {
  const doc = { createdAt: new Date(), ...data }
  const result = await col().insertOne(doc)
  return { ...doc, _id: result.insertedId }
}

export async function findById(id) {
  const _id = toId(id)
  return _id ? col().findOne({ _id }) : null
}

export function listByPost(postId) {
  return col().find({ postId }).sort({ createdAt: 1 }).toArray()
}

export async function removeComment(id) {
  await col().deleteOne({ _id: toId(id) })
}

export async function deleteByPost(postId) {
  await col().deleteMany({ postId })
}

export async function deleteByPosts(postIds) {
  await col().deleteMany({ postId: { $in: postIds } })
}

export async function deleteByUser(userId) {
  await col().deleteMany({ userId })
}

export async function countByPosts(postIds) {
  const rows = await col()
    .aggregate([{ $match: { postId: { $in: postIds } } }, { $group: { _id: '$postId', total: { $sum: 1 } } }])
    .toArray()
  return Object.fromEntries(rows.map((row) => [row._id, row.total]))
}
