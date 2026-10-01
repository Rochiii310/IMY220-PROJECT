export default function Profile({ user, isOwner, onEdit }) {
  return (
    <div className="profile">
      <img className="profile-avatar" src={user.avatar} alt={user.name} />
      <div className="profile-info">
        <h2>
          {user.name}
          {user.verified && <span className="verified-badge" title="Verified">✓</span>}
        </h2>
        <p className="profile-username">{user.username}</p>
        <p className="profile-bio">{user.bio}</p>
        {isOwner && (
          <button type="button" className="btn btn-secondary" onClick={onEdit}>
            Edit profile
          </button>
        )}
      </div>
    </div>
  )
}
