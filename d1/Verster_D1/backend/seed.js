import { ObjectId } from 'mongodb'
import { getDb } from './db.js'
import { hashPassword } from './auth.js'

export async function seedIfEmpty() {
  const db = getDb()
  if ((await db.collection('users').countDocuments()) > 0) return

  const passwordHash = hashPassword('test1234')
  const ago = (hours) => new Date(Date.now() - hours * 60 * 60 * 1000)
  const [u1, u2, u3] = [new ObjectId(), new ObjectId(), new ObjectId()]
  const [id1, id2, id3] = [String(u1), String(u2), String(u3)]

  await db.collection('users').insertMany([
    {
      _id: u1,
      name: 'Test User',
      username: '@testuser',
      email: 'test@test.com',
      passwordHash,
      bio: 'Chasing golden hour, one frame at a time.',
      avatar: 'https://i.pravatar.cc/150?img=12',
      verified: true,
      role: 'user',
      friends: [id2],
      requestsSent: [],
      requestsReceived: [id3],
      createdAt: ago(500)
    },
    {
      _id: u2,
      name: 'Naledi Khumalo',
      username: '@naledi.k',
      email: 'naledi@example.com',
      passwordHash,
      bio: 'Street photography, Pretoria based.',
      avatar: 'https://i.pravatar.cc/150?img=32',
      verified: true,
      role: 'user',
      friends: [id1],
      requestsSent: [],
      requestsReceived: [],
      createdAt: ago(480)
    },
    {
      _id: u3,
      name: 'Sam Ortega',
      username: '@samo',
      email: 'sam@example.com',
      passwordHash,
      bio: 'Film shooter. Mostly 35mm.',
      avatar: 'https://i.pravatar.cc/150?img=15',
      verified: false,
      role: 'user',
      friends: [],
      requestsSent: [id1],
      requestsReceived: [],
      createdAt: ago(460)
    }
  ])

  const postData = [
    [id1, 'Sunset over the city skyline, shot on a rooftop downtown.', 1015, ['#sunset', '#skyline'], [id2, id3], 3],
    [id2, 'Quiet morning market streets before the crowds arrive.', 1024, ['#streetphotography', '#morning'], [id1], 5],
    [id3, 'Old film roll, developed after two years in a drawer.', 1035, ['#film', '#35mm'], [id1, id2], 24],
    [id1, 'Autumn leaves along the river path near campus.', 1043, ['#autumn', '#nature'], [id2], 26],
    [id2, 'Portrait study using only window light.', 1005, ['#portrait'], [id1, id3], 48],
    [id3, 'Mountains at dawn, temperature dropped to -2.', 1018, ['#landscape', '#mountains'], [id1], 50],
    [id1, 'Coffee and a rainy window, a slow Sunday.', 225, ['#coffee', '#rain'], [], 72],
    [id2, 'Neon signs in the old part of town, long exposure.', 1039, ['#neon', '#longexposure'], [id1, id3], 96],
    [id3, 'A quiet harbour before the boats head out.', 1050, ['#harbour'], [id2], 120],
    [id1, 'Wildflowers along the hiking trail this weekend.', 106, ['#hiking', '#flowers'], [id2, id3], 144]
  ]

  const insertedPosts = await db.collection('posts').insertMany(
    postData.map(([userId, description, photo, hashtags, likes, hours]) => ({
      userId,
      description,
      image: `https://picsum.photos/id/${photo}/800/500`,
      hashtags,
      likes,
      createdAt: ago(hours)
    }))
  )
  const postIds = Object.values(insertedPosts.insertedIds).map(String)

  await db.collection('albums').insertMany([
    { userId: id1, name: 'City Nights', description: 'Long exposures around town.', hashtags: ['#city', '#night'], postIds: [postIds[0]], createdAt: ago(300) },
    { userId: id1, name: 'Weekend Trails', description: 'Hikes and nature walks.', hashtags: ['#hiking', '#nature'], postIds: [postIds[3], postIds[9]], createdAt: ago(290) },
    { userId: id2, name: 'Street Stories', description: 'Candid street photography.', hashtags: ['#street'], postIds: [postIds[1], postIds[7]], createdAt: ago(280) },
    { userId: id3, name: 'Film Rolls', description: 'Analog photography archive.', hashtags: ['#film'], postIds: [postIds[2]], createdAt: ago(270) },
    { userId: id2, name: 'Portraits', description: 'Natural light portrait studies.', hashtags: ['#portrait'], postIds: [postIds[4]], createdAt: ago(260) }
  ])

  await db.collection('comments').insertMany([
    { postId: postIds[0], userId: id2, text: 'This light is unreal.', createdAt: ago(2) },
    { postId: postIds[0], userId: id3, text: 'Where was this taken?', createdAt: ago(1) },
    { postId: postIds[1], userId: id1, text: 'Love the quiet mood here.', createdAt: ago(4) }
  ])

  await db.collection('reasons').insertMany(
    ['Spam', 'Inappropriate content', 'Harassment', 'Copyright infringement', 'Other'].map((text) => ({ text }))
  )
}
