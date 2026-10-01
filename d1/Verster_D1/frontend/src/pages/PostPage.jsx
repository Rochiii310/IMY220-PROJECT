import { useParams } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Post from '../components/Post.jsx'
import { posts } from '../data/dummyData.js'

export default function PostPage() {
  const { id } = useParams()
  const post = posts.find((p) => p.id === id) || posts[0]

  return (
    <div className="page">
      <Header />
      <div className="container">
        <Post post={post} />
      </div>
    </div>
  )
}
