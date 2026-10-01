import { getDb } from '../db.js'

const reports = () => getDb().collection('reports')
const reasons = () => getDb().collection('reasons')

export async function listReasons() {
  const rows = await reasons().find({}).sort({ _id: 1 }).toArray()
  return rows.map((row) => row.text)
}

export async function addReason(text) {
  await reasons().insertOne({ text })
}

export function findReport(postId, userId) {
  return reports().findOne({ postId, userId })
}

export async function createReport(data) {
  const doc = { createdAt: new Date(), ...data }
  const result = await reports().insertOne(doc)
  return { ...doc, _id: result.insertedId }
}

export async function deleteByPost(postId) {
  await reports().deleteMany({ postId })
}

export async function deleteByPosts(postIds) {
  await reports().deleteMany({ postId: { $in: postIds } })
}
