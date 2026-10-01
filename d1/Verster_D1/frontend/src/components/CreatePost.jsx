import { useState } from 'react'

export default function CreatePost({ onCreate }) {
  const [description, setDescription] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [touched, setTouched] = useState(false)

  const descriptionError = description.trim().length < 5
    ? 'Description must be at least 5 characters.'
    : ''

  function handleSubmit(e) {
    e.preventDefault()
    setTouched(true)
    if (descriptionError) return

    const tags = hashtags
      .split(' ')
      .map((t) => t.trim())
      .filter(Boolean)

    if (onCreate) {
      onCreate({ description: description.trim(), hashtags: tags })
    }
    setDescription('')
    setHashtags('')
    setTouched(false)
  }

  return (
    <form className="create-post" onSubmit={handleSubmit} noValidate>
      <h3>Create a post</h3>
      <div className="field">
        <label htmlFor="post-description">Description</label>
        <textarea
          id="post-description"
          rows="3"
          value={description}
          data-touched={touched}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => setTouched(true)}
        />
        {touched && descriptionError && <span className="field-error">{descriptionError}</span>}
      </div>
      <div className="field">
        <label htmlFor="post-hashtags">Hashtags</label>
        <input
          id="post-hashtags"
          type="text"
          placeholder="#travel #sunset"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
        />
      </div>
      <button type="submit" className="btn">Post</button>
    </form>
  )
}
