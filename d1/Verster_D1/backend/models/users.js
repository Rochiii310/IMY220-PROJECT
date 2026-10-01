import { getDb } from '../db.js'
import { toId, escapeRegex } from '../utils.js'

const col = () => getDb().collection('users')

export async function createUser(data) {
  const doc = {
    bio: '',
    verified: false,
    role: 'user',
    friends: [],
    requestsSent: [],
    requestsReceived: [],
    createdAt: new Date(),
    ...data
  }
  const result = await col().insertOne(doc)
  return { ...doc, _id: result.insertedId }
}

export async function findById(id) {
  const _id = toId(id)
  return _id ? col().findOne({ _id }) : null
}

export function findByEmail(email) {
  return col().findOne({ email: String(email).toLowerCase() })
}

export function findByUsername(username) {
  return col().findOne({ username })
}

export async function findMany(ids) {
  const objectIds = ids.map(toId).filter(Boolean)
  return objectIds.length ? col().find({ _id: { $in: objectIds } }).toArray() : []
}

export function search(term) {
  const rx = new RegExp(escapeRegex(term), 'i')
  return col().find({ $or: [{ name: rx }, { username: rx }] }).limit(20).toArray()
}

export function listAll() {
  return col().find({}).limit(20).toArray()
}

export async function uniqueUsername(name) {
  const base = `@${name.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'user'}`
  let candidate = base
  while (await findByUsername(candidate)) {
    candidate = `${base}${Math.floor(100 + Math.random() * 900)}`
  }
  return candidate
}

export async function updateUser(id, fields) {
  await col().updateOne({ _id: toId(id) }, { $set: fields })
  return findById(id)
}

export async function deleteUser(id) {
  await col().deleteOne({ _id: toId(id) })
  await col().updateMany({}, { $pull: { friends: id, requestsSent: id, requestsReceived: id } })
}

const push = (id, field, value) => col().updateOne({ _id: toId(id) }, { $addToSet: { [field]: value } })
const pull = (id, field, value) => col().updateOne({ _id: toId(id) }, { $pull: { [field]: value } })

export async function sendRequest(fromId, toUserId) {
  await push(fromId, 'requestsSent', toUserId)
  await push(toUserId, 'requestsReceived', fromId)
}

export async function acceptRequest(userId, fromId) {
  await pull(userId, 'requestsReceived', fromId)
  await pull(fromId, 'requestsSent', userId)
  await push(userId, 'friends', fromId)
  await push(fromId, 'friends', userId)
}

export async function cancelRequest(fromId, toUserId) {
  await pull(fromId, 'requestsSent', toUserId)
  await pull(toUserId, 'requestsReceived', fromId)
}

export async function removeFriend(a, b) {
  await pull(a, 'friends', b)
  await pull(b, 'friends', a)
}
