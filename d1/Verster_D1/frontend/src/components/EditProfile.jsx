import { useState } from 'react'

export default function EditProfile({ user, onSave, onCancel }) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [bio, setBio] = useState(user.bio)
  const [touched, setTouched] = useState({ name: false, email: false })

  const nameError = name.trim().length === 0 ? 'Name is required.' : ''
  const emailError = !email.includes('@') ? 'Enter a valid email address.' : ''
  const hasErrors = Boolean(nameError || emailError)

  function handleSubmit(e) {
    e.preventDefault()
    setTouched({ name: true, email: true })
    if (hasErrors) return
    if (onSave) onSave({ ...user, name, email, bio })
  }

  return (
    <form className="edit-profile" onSubmit={handleSubmit} noValidate>
      <h3>Edit profile</h3>
      <div className="field">
        <label htmlFor="edit-name">Name</label>
        <input
          id="edit-name"
          type="text"
          value={name}
          data-touched={touched.name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
        />
        {touched.name && nameError && <span className="field-error">{nameError}</span>}
      </div>
      <div className="field">
        <label htmlFor="edit-email">Email</label>
        <input
          id="edit-email"
          type="email"
          value={email}
          data-touched={touched.email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
        />
        {touched.email && emailError && <span className="field-error">{emailError}</span>}
      </div>
      <div className="field">
        <label htmlFor="edit-bio">Bio</label>
        <textarea
          id="edit-bio"
          rows="3"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>
      <div className="edit-profile-actions">
        <button type="submit" className="btn" disabled={hasErrors}>Save</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}
