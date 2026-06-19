import { useState } from 'react'
import './App.css'

function App() {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [submitted, setSubmitted] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !age) return alert('Fill both fields, Vaishnavi 💚')
    setSubmitted({ name, age })
    setName('')
    setAge('')
  }

  return (
    <div className="container">
      <h1>Sakala Day 10 🚀</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Your Name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input 
          type="number" 
          placeholder="Your Age" 
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <button type="submit">Ship It</button>
      </form>

      {submitted && (
        <div className="result">
          <h3>Data Logged ✅</h3>
          <p>Name: {submitted.name}</p>
          <p>Age: {submitted.age}</p>
          <p>Next: Send this to backend on Day 11</p>
        </div>
      )}
    </div>
  )
}

export default App
