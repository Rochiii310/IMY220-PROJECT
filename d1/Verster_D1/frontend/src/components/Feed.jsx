import PostPreview from './PostPreview.jsx'

export default function Feed({ posts }) {
  if (!posts.length) {
    return <p>No posts to show yet.</p>
  }

  return (
    <div className="feed">
      {posts.map((post) => (
        <PostPreview key={post.id} post={post} />
      ))}
    </div>
  )
}
