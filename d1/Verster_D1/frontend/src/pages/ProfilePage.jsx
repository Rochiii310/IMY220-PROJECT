import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Profile from '../components/Profile.jsx'
import EditProfile from '../components/EditProfile.jsx'
import Friend from '../components/Friend.jsx'
import CreatePost from '../components/CreatePost.jsx'
import Feed from '../components/Feed.jsx'
import { currentUser, friends, posts, getUserById } from '../data/dummyData.js'

export default function ProfilePage() {
  const { id } = useParams()
  const [user, setUser] = useState(getUserById(id) || currentUser)
  const [editing, setEditing] = useState(false)
  const isOwner = user.id === currentUser.id

  const userPosts = posts.filter((p) => p.userId === user.id)

  return (
    <div className="page">
      <Header />
      <div className="container">
        {editing ? (
          <EditProfile
            user={user}
            onCancel={() => setEditing(false)}
            onSave={(updated) => {
              setUser(updated)
              setEditing(false)
            }}
          />
        ) : (
          <Profile user={user} isOwner={isOwner} onEdit={() => setEditing(true)} />
        )}
        <hr className="divider" />
        <Friend friends={friends} />
        <hr className="divider" />
        {isOwner && (
          <>
            <CreatePost onCreate={() => {}} />
            <hr className="divider" />
          </>
        )}
        <h3>Posts</h3>
        <Feed posts={userPosts} />
      </div>
    </div>
  )
}
