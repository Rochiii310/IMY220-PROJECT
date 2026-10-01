import { getDb } from '../db.js'
import { toId } from '../utils.js'

const col = () => getDb().collection('albums')

export async function createAlbum(data) {
  const doc = { postIds: [], createdAt: new Date(), ...data }
  const result = await col().insertOne(doc)
  return { ...doc, _id: result.insertedId }
}

export async function findById(id) {
  const _id = toId(id)
  return _id ? col().findOne({ _id }) : null
}

export function list(filter) {
  return col().find(filter).sort({ createdAt: -1 }).limit(100).toArray()
}

export async function updateAlbum(id, fields) {
  await col().updateOne({ _id: toId(id) }, { $set: fields })
  return findById(id)
}

export async function deleteAlbum(id) {
  await col().deleteOne({ _id: toId(id) })
}

export async function deleteByUser(userId) {
  await col().deleteMany({ userId })
}

export async function addPost(id, postId) {
  await col().updateOne({ _id: toId(id) }, { $addToSet: { postIds: postId } })
  return findById(id)
}

export async function removePost(id, postId) {
  await col().updateOne({ _id: toId(id) }, { $pull: { postIds: postId } })
  return findById(id)
}

export async function removePostFromAll(postId) {
  await col().updateMany({}, { $pull: { postIds: postId } })
}

export async function removePostsFromAll(postIds) {
  await col().updateMany({}, { $pull: { postIds: { $in: postIds } } })
}
