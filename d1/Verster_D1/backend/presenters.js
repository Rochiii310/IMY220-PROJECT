import * as users from './models/users.js'
import * as comments from './models/comments.js'
import { summary } from './utils.js'

async function authorMap(userIds) {
  const authors = await users.findMany([...new Set(userIds)])
  return new Map(authors.map((author) => [String(author._id), summary(author)]))
}

export async function presentPosts(posts, viewerId) {
  const authors = await authorMap(posts.map((post) => post.userId))
  const counts = await comments.countByPosts(posts.map((post) => String(post._id)))
  return posts.map((post) => ({
    id: String(post._id),
    userId: post.userId,
    description: post.description,
    image: post.image,
    hashtags: post.hashtags,
    createdAt: post.createdAt,
    likes: post.likes.length,
    liked: post.likes.includes(viewerId),
    commentCount: counts[String(post._id)] || 0,
    author: authors.get(post.userId) || null
  }))
}

export async function presentComments(list) {
  const authors = await authorMap(list.map((comment) => comment.userId))
  return list.map((comment) => ({
    id: String(comment._id),
    postId: comment.postId,
    userId: comment.userId,
    text: comment.text,
    createdAt: comment.createdAt,
    author: authors.get(comment.userId) || null
  }))
}

export async function presentAlbums(albums) {
  const authors = await authorMap(albums.map((album) => album.userId))
  return albums.map((album) => ({
    id: String(album._id),
    userId: album.userId,
    name: album.name,
    description: album.description,
    hashtags: album.hashtags,
    postIds: album.postIds,
    postCount: album.postIds.length,
    createdAt: album.createdAt,
    author: authors.get(album.userId) || null
  }))
}
