import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get('http://localhost:3000/users')
      .then(res => {
        setUsers(res.data)
        setError('')
      })
      .catch(err => {
        setError('Backend not running. Check if node index.js is still up.')
        console.error(err)
      })
  }, [])

  return (
    <div style={{padding: '40px', fontFamily: 'system-ui', backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh'}}>
      <h1 style={{color: '#61dafb'}}>MERN Day 8: Full Stack Live ⚛️</h1>
      <h2>Data from SakalaCluster - Mumbai</h2>
      
      {error && <h2 style={{color: '#ff6b6b'}}>{error}</h2>}
      {!error && !users.length && <h2>Loading from MongoDB Atlas...</h2>}
      
      {users.map(user => (
        <div key={user._id} style={{
          border: '2px solid #61dafb', 
          margin: '20px 0', 
          padding: '20px', 
          borderRadius: '12px',
          backgroundColor: '#242424'
        }}>
          <h3 style={{margin: 0, color: '#61dafb'}}>Name: {user.name}</h3>
          <p style={{margin: '10px 0 0', fontSize: '14px', color: '#888'}}>
            MongoDB _id: {user._id}
          </p>
        </div>
      ))}
    </div>
  )
}

export default App
