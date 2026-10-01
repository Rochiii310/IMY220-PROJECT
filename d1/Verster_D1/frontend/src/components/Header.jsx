import { Link } from 'react-router-dom'
import { currentUser } from '../data/dummyData.js'
import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner container">
        <Link to="/home" className="header-logo">Shutter</Link>
        <nav className="header-nav">
          <Link to="/home">Feed</Link>
          <Link to={`/profile/${currentUser.id}`}>Profile</Link>
        </nav>
        <Link to={`/profile/${currentUser.id}`} className="header-avatar">
          <img src={currentUser.avatar} alt={currentUser.name} />
        </Link>
      </div>
    </header>
  )
}
