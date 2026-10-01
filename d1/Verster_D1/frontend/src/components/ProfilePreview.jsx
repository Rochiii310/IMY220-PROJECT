import { Link } from 'react-router-dom'

export default function ProfilePreview({ user }) {
  return (
    <Link to={`/profile/${user.id}`} className="profile-preview">
      <img src={user.avatar} alt={user.name} />
      <div>
        <p className="profile-preview-name">
          {user.name}
          {user.verified && <span className="verified-badge" title="Verified">✓</span>}
        </p>
        <p className="profile-preview-username">{user.username}</p>
      </div>
    </Link>
  )
}
