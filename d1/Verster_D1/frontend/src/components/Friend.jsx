import ProfilePreview from './ProfilePreview.jsx'

export default function Friend({ friends }) {
  return (
    <div className="friend-list">
      <h3>Friends</h3>
      {friends.length === 0 && <p>No friends yet.</p>}
      {friends.map((friend) => (
        <ProfilePreview key={friend.id} user={friend} />
      ))}
    </div>
  )
}
