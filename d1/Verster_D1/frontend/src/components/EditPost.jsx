import { useState } from 'react'

export default function EditPost({ post, onSave, onCancel }) {
  const [description, setDescription] = useState(post.description)
  const [hashtags, setHashtags] = useState(post.hashtags.join(' '))

  function handleSubmit(e) {
    e.preventDefault()
    if (onSave) {
      onSave({
        ...post,
        description,
        hashtags: hashtags.split(' ').map((t) => t.trim()).filter(Boolean)
      })
    }
  }

  return (
    <form className="edit-post" onSubmit={handleSubmit}>
      <h3>Edit post</h3>
      <div className="field">
        <label htmlFor="edit-description">Description</label>
        <textarea
          id="edit-description"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="edit-hashtags">Hashtags</label>
        <input
          id="edit-hashtags"
          type="text"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
        />
      </div>
      <div className="edit-post-actions">
        <button type="submit" className="btn">Save</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}
