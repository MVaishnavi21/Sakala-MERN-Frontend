import { useState, useContext } from 'react'
import {useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import API from '../api/axios'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post('/auth/login', { username, password })
      login(res.data.token) // stores token
      navigate('/dashboard') // go to protected page
    } catch (err) {
      alert('Login failed')
    }
  }

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <input 
        placeholder="Username" 
        value={username}
        onChange={e => setUsername(e.target.value)} 
      />
      <input 
        type="password"
        placeholder="Password" 
        value={password}
        onChange={e => setPassword(e.target.value)} 
      />
      <button type="submit">Login</button>
    </form>
    
    <p style={{ color: '#737373', fontSize: '14px', textAlign: 'center', marginTop: '24px' }}>
        Don't have an account? <Link to="/register" style={{ color: '#3b82f6', textDecoration: 'none' }}>Register</Link>
      </p>
    </div>
  )
}

export default Login