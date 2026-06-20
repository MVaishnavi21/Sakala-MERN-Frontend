import { useState } from 'react'
import './App.css'

function App() {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('') 

const handleSubmit = async (e) => {
  e.preventDefault()

  // Clear old messages
  setMessage('')
  
  // VALIDATION STARTS HERE 
  if (!name.trim() || !age || !email.trim()) {
    return setMessage('❌ Fill all fields, Vaishnavi')
  }
  
  if (isNaN(age) || Number(age) < 1 || Number(age) > 120) {
    return setMessage('❌ Age must be a number between 1-120')
  }
  
  if (!email.includes('@') || !email.includes('.')) {
    return setMessage('❌ Enter a valid email')
  }
  // VALIDATION ENDS HERE 
  
  try {
    const res = await fetch('http://localhost:3000/profile', {  // change /api/skills → /profile
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), age: Number(age), email: email.trim() })
    })
    
    const data = await res.json()
    
    if (res.ok) {
    setMessage(`✅ Shipped: ${data.data.name}, ${data.data.age}`)  // note: data.data.name
    setName('')
    setAge('')
    setEmail('')
    } else {
      setMessage(`❌ Error: ${data.message}`)
    }
  } catch (err) {
    setMessage('❌ Server not running?')
  }
}

  return (
  <div className="container">
    <h1>Sakala Day 10 🚀</h1>
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input 
        type="number" 
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="Age"
      />
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button type="submit">Ship It</button>
    </form>
    
    {message && <p className="result">{message}</p>}
    
  </div>
)
}

export default App
