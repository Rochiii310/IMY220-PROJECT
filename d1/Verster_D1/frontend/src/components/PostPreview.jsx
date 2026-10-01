import { Link } from 'react-router-dom'
import { getUserById } from '../data/dummyData.js'
import './PostPreview.css'

export default function PostPreview({ post }) {
  const author = getUserById(post.userId)

  return (
    <article className="post-preview">
      <div className="post-preview-head">
        <Link to={`/profile/${author.id}`} className="post-preview-author">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </Link>
        <span className="post-preview-time">{post.createdAt}</span>
      </div>
      <Link to={`/post/${post.id}`}>
        <img className="post-preview-image" src={post.image} alt={post.description} />
      </Link>
      <p className="post-preview-description">{post.description}</p>
      <div className="post-preview-tags">
        {post.hashtags.map((tag) => (
          <span key={tag} className="hashtag">{tag}</span>
        ))}
      </div>
      <div className="post-preview-footer">
        <span>{post.likes} likes</span>
        <Link to={`/post/${post.id}`}>{post.comments.length} comments</Link>
      </div>
    </article>
  )
}
