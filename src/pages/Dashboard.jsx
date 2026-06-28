import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

function Dashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    API.get('/users')
     .then(res => {
        setUsers(res.data)
        setLoading(false)
      })
     .catch(() => {
        logout()
        navigate('/login')
      })
  }, [logout, navigate])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) return <div style={styles.container}><h2>Loading...</h2></div>

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Dashboard</h1>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>

        <h2 style={styles.subtitle}>All Users</h2>
        <div style={styles.userList}>
          {users.map(u => (
            <div key={u._id} style={styles.userCard}>
              <div style={styles.avatar}>{u.name?.[0]?.toUpperCase()}</div>
              <div>
                <p style={styles.userName}>{u.name || u.username}</p>
                <p style={styles.userEmail}>{u.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    color: '#e5e5e5',
    padding: '40px 20px',
    fontFamily: 'system-ui, sans-serif'
  },
  card: {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '32px',
    border: '1px solid #2a2a2a'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  title: {
    fontSize: '28px',
    margin: 0
  },
  logoutBtn: {
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  subtitle: {
    fontSize: '18px',
    color: '#a3a3a3',
    marginBottom: '16px'
  },
  userList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    backgroundColor: '#0f0f0f',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #2a2a2a'
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  userName: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600'
  },
  userEmail: {
    margin: '4px 0 0 0',
    fontSize: '14px',
    color: '#737373'
  }
}

export default Dashboard