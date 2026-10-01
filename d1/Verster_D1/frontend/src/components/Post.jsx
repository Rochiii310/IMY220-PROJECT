import { useState } from 'react'
import { Link } from 'react-router-dom'
import { currentUser, getUserById } from '../data/dummyData.js'
import Image from './Image.jsx'
import Comments from './Comments.jsx'
import EditPost from './EditPost.jsx'

export default function Post({ post }) {
  const [editing, setEditing] = useState(false)
  const [currentPost, setCurrentPost] = useState(post)
  const author = getUserById(currentPost.userId)
  const isOwner = author.id === currentUser.id

  if (editing) {
    return (
      <EditPost
        post={currentPost}
        onCancel={() => setEditing(false)}
        onSave={(updated) => {
          setCurrentPost(updated)
          setEditing(false)
        }}
      />
    )
  }

  return (
    <article className="post">
      <div className="post-head">
        <Link to={`/profile/${author.id}`} className="post-author">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </Link>
        <span className="post-time">{currentPost.createdAt}</span>
      </div>
      <Image src={currentPost.image} alt={currentPost.description} />
      <p className="post-description">{currentPost.description}</p>
      <div className="post-tags">
        {currentPost.hashtags.map((tag) => (
          <span key={tag} className="hashtag">{tag}</span>
        ))}
      </div>
      <div className="post-footer">
        <span>{currentPost.likes} likes</span>
        {isOwner && (
          <button type="button" className="btn btn-secondary" onClick={() => setEditing(true)}>
            Edit
          </button>
        )}
      </div>
      <hr className="divider" />
      <Comments comments={currentPost.comments} />
    </article>
  )
}
