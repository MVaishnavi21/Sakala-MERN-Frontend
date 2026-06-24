import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)

  const startEdit = (user) => {
    setName(user.name)
    setAge(user.age)
    setEmail(user.email)
    setEditingId(user._id)
  }

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
  
  if (!name.trim() || !age || !email.trim()) {
    return setMessage('❌ Fill all fields, Vaishnavi')
  }
  if (isNaN(age) || Number(age) < 1 || Number(age) > 120) {
    return setMessage('❌ Age must be between 1-120')
  }
  if (!email.includes('@')) {
    return setMessage('❌ Enter a valid email')
  }

  try {
    if (editingId) {
      // UPDATE mode
      const res = await axios.put(`http://localhost:3000/users/${editingId}`, {
        name: name.trim(), 
        age: Number(age), 
        email: email.trim()
      })
      setMessage(`✅ Updated: ${res.data.data.name}`)
      setEditingId(null)
    } else {
      // CREATE mode
      const res = await axios.post('http://localhost:3000/users', {
        name: name.trim(), 
        age: Number(age), 
        email: email.trim()
      })
      setMessage(`✅ Shipped: ${res.data.data.name}, ${res.data.data.age}`)
    }
    
    setName('')
    setAge('')
    setEmail('')
    fetchUsers()
    
  } catch (err) {
    setMessage('❌ Server error')
    console.log(err)
  }
}

  return (
    <div >
      <h1>Sakala MERN - Day 14: Full CRUD 💚</h1>
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
          users.length === 0 ? <p>No users yet. Add one!</p> : 
          users.map(user => (
  <div key={user._id}>
    <strong>{user.name}</strong> | Age: {user.age} | {user.email}
    <button onClick={() => startEdit(user)}>✏️ Edit</button>
    <button onClick={() => deleteUser(user._id)}>🗑️ Delete</button>
  </div>
))

        }
      </div>
    </div>
  )
}

export default App