import { useState } from 'react'
import Header from '../components/Header.jsx'
import SearchInput from '../components/SearchInput.jsx'
import CreatePost from '../components/CreatePost.jsx'
import Feed from '../components/Feed.jsx'
import { posts as allPosts, currentUser, friends } from '../data/dummyData.js'

export default function Home() {
  const [posts, setPosts] = useState(allPosts)
  const [feedType, setFeedType] = useState('global')

  const friendIds = friends.map((f) => f.id)
  const localPosts = posts.filter((p) => p.userId === currentUser.id || friendIds.includes(p.userId))
  const visiblePosts = feedType === 'global' ? posts : localPosts

  function handleCreate({ description, hashtags }) {
    const newPost = {
      id: `p${Date.now()}`,
      userId: currentUser.id,
      description,
      image: 'https://picsum.photos/800/500',
      hashtags,
      likes: 0,
      createdAt: 'just now',
      comments: []
    }
    setPosts([newPost, ...posts])
  }

  return (
    <div className="page">
      <Header />
      <div className="container">
        <SearchInput onSearch={() => {}} />
        <CreatePost onCreate={handleCreate} />
        <hr className="divider" />
        <div className="feed-toggle">
          <button
            type="button"
            className={feedType === 'local' ? 'btn' : 'btn btn-secondary'}
            onClick={() => setFeedType('local')}
          >
            Following
          </button>
          <button
            type="button"
            className={feedType === 'global' ? 'btn' : 'btn btn-secondary'}
            onClick={() => setFeedType('global')}
          >
            Global
          </button>
        </div>
        <Feed posts={visiblePosts} />
      </div>
    </div>
  )
}
