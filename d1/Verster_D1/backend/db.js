import { MongoClient } from 'mongodb'

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017'
const dbName = process.env.DB_NAME || 'shutter'

let db

export async function connect() {
  for (let attempt = 1; attempt <= 30; attempt++) {
    try {
      const client = new MongoClient(uri, { serverSelectionTimeoutMS: 3000 })
      await client.connect()
      db = client.db(dbName)
      console.log('Connected to MongoDB')
      return db
    } catch {
      console.log(`Waiting for MongoDB (attempt ${attempt})...`)
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }
  throw new Error('Could not connect to MongoDB')
}

export function getDb() {
  return db
}
