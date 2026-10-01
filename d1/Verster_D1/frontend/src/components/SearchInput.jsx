import { useState } from 'react'
import './SearchInput.css'

export default function SearchInput({ onSearch }) {
  const [term, setTerm] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (onSearch) onSearch(term)
  }

  return (
    <form className="search-input" onSubmit={handleSubmit}>
      <label htmlFor="search-term" className="visually-hidden">Search</label>
      <input
        id="search-term"
        type="text"
        placeholder="Search users, posts, albums, hashtags..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <button type="submit" className="btn">Search</button>
    </form>
  )
}
