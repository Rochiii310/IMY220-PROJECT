import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function SignupForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [touched, setTouched] = useState(false)
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()

  const nameError = name.trim().length === 0 ? 'Name is required.' : ''
  const emailError = !email.includes('@') ? 'Enter a valid email address.' : ''
  const passwordError = password.length < 8 ? 'Password must be at least 8 characters.' : ''
  const confirmError = confirmPassword !== password ? 'Passwords do not match.' : ''
  const hasErrors = Boolean(nameError || emailError || passwordError || confirmError)

  async function handleSubmit(e) {
    e.preventDefault()
    setTouched(true)
    setServerError('')
    if (hasErrors) return

    try {
      const response = await fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await response.json()

      if (!response.ok) {
        setServerError(data.message || 'Sign up failed.')
        return
      }

      navigate('/home')
    } catch {
      setServerError('Could not reach the server.')
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <h2>Sign up</h2>
      <div className="field">
        <label htmlFor="signup-name">Name</label>
        <input
          id="signup-name"
          type="text"
          value={name}
          data-touched={touched}
          onChange={(e) => setName(e.target.value)}
        />
        {touched && nameError && <span className="field-error">{nameError}</span>}
      </div>
      <div className="field">
        <label htmlFor="signup-email">Email</label>
        <input
          id="signup-email"
          type="email"
          value={email}
          data-touched={touched}
          onChange={(e) => setEmail(e.target.value)}
        />
        {touched && emailError && <span className="field-error">{emailError}</span>}
      </div>
      <div className="field">
        <label htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          type="password"
          value={password}
          data-touched={touched}
          onChange={(e) => setPassword(e.target.value)}
        />
        {touched && passwordError && <span className="field-error">{passwordError}</span>}
      </div>
      <div className="field">
        <label htmlFor="signup-confirm">Confirm password</label>
        <input
          id="signup-confirm"
          type="password"
          value={confirmPassword}
          data-touched={touched}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {touched && confirmError && <span className="field-error">{confirmError}</span>}
      </div>
      {serverError && <p className="field-error">{serverError}</p>}
      <button type="submit" className="btn">Sign up</button>
    </form>
  )
}
