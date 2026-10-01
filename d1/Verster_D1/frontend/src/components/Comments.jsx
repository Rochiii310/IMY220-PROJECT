import { getUserById } from '../data/dummyData.js'

export default function Comments({ comments }) {
  return (
    <div className="comments">
      <h3>Comments</h3>
      {comments.length === 0 && <p>No comments yet.</p>}
      {comments.map((comment) => {
        const author = getUserById(comment.userId)
        return (
          <div className="comment" key={comment.id}>
            <img src={author.avatar} alt={author.name} />
            <div>
              <p className="comment-author">{author.name}</p>
              <p className="comment-text">{comment.text}</p>
              <span className="comment-time">{comment.createdAt}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
