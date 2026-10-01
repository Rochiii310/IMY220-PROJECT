import LoginForm from '../components/LoginForm.jsx'
import SignupForm from '../components/SignupForm.jsx'
import './Splash.css'

export default function Splash() {
  return (
    <div className="page splash">
      <div className="splash-hero">
        <h1>Shutter</h1>
        <p>Share the moments worth keeping.</p>
      </div>
      <div className="splash-forms container">
        <LoginForm />
        <hr className="divider" />
        <SignupForm />
      </div>
    </div>
  )
}
