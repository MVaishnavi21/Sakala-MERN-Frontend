import { useState, useEffect } from 'react'

function App() {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:3000/users')
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      console.log('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id) => {
    try {
      await fetch(`http://localhost:3000/users/${id}`, {
        method: 'DELETE'
      })
      fetchUsers() // Refresh list
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [message])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    if (!name.trim() ||!age ||!email.trim()) {
      return setMessage('❌ Fill all fields, Vaishnavi')
    }
    if (isNaN(age) || Number(age) < 1 || Number(age) > 120) {
      return setMessage('❌ Age must be between 1-120')
    }
    if (!email.includes('@')) {
      return setMessage('❌ Enter a valid email')
    }

    try {
      const res = await fetch('http://localhost:3000/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), age: Number(age), email: email.trim() })
      })
      const data = await res.json()

      if (res.ok) {
        setMessage(`✅ Shipped: ${data.data.name}, ${data.data.age}`)
        setName('')
        setAge('')
        setEmail('')
      } else {
        setMessage(`❌ ${data.message}`)
      }
    } catch (err) {
      setMessage('❌ Server not running?')
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>Sakala MERN - Day 12</h2>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <input value={age} onChange={e => setAge(e.target.value)} placeholder="Age" type="number" />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" />
        <button type="submit">Ship It</button>
      </form>
      <p>{message}</p>
      <div style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
        <h3>All Users from MongoDB ({users.length})</h3>
        {loading? <p>Loading...</p> :
          users.length === 0? <p>No users yet. Add one!</p> :
          users.map(user => (
            <div key={user._id} style={{ border: '1px solid #eee', padding: '10px', margin: '5px 0', borderRadius: '5px' }}>
              <strong>{user.name}</strong> | Age: {user.age || 'N/A'} | {user.email}
    
              <button 
                onClick={() => deleteUser(user._id)}
                style={{ marginLeft: '10px', background: '#ff4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
              >
                🗑️ Delete
              </button>
    
            </div>
        ))
        }
      </div>
    </div>
  )
}

export default App