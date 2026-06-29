import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { Toaster, toast } from 'react-hot-toast'

function Dashboard() {
  const [editingUser, setEditingUser] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', email: '' })
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const handleEdit = (user) => {
  setEditingUser(user)
  setEditForm({ name: user.name || '', email: user.email || '' })
}

const handleUpdate = async (id) => {
  const toastId = toast.loading('Updating user...')
  try {
    const res = await API.put(`/users/${id}`, editForm)
    console.log('Full backend response:', res.data) // 👈 Add this
    
    // Then use ONE of these based on what you see:
    // If res.data = {message: '...', data: {_id: '...', name: '...'}} 
    setUsers(prev => prev.map(u => u._id === id ? res.data : u))
    
    // If res.data = {_id: '...', name: '...'} 
    // setUsers(prev => prev.map(u => u._id === id ? res.data : u))
    
    setEditingUser(null)
    toast.success('User updated', { id: toastId })
  } catch (err) {
    console.log('Update error:', err.response?.data || err)
    toast.error('Update failed', { id: toastId })
  }
}

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

  const handleDelete = async (id) => {
  const toastId = toast.loading('Deleting...')
  try {
    await API.delete(`/users/${id}`)
    setUsers(users.filter(u => u._id !== id))
    toast.success('User deleted', { id: toastId })
  } catch {
    toast.error('Delete failed', { id: toastId })
  }
}

  if (loading) return <div style={styles.container}><h2>Loading...</h2></div>

  return (
    <>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>Dashboard</h1>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            <button onClick={() => handleUpdate(editingUser._id)}>Save</button>
          </div>

          <h2 style={styles.subtitle}>All Users</h2>
          <div style={styles.userList}>
            {users.map((u) => (
              <div key={u._id} style={styles.userCard}>
                <div style={styles.avatar}>{u.name?.[0]?.toUpperCase() || u.username?.[0]?.toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <p style={styles.userName}>{u.name || u.username}</p>
                  <p style={styles.userEmail}>{u.email}</p>
                </div>
                <div style={styles.actionBtns}>
                  <button onClick={() => handleEdit(u)} style={styles.editBtn}>Edit</button>
                  <button onClick={() => handleDelete(u._id)} style={styles.deleteBtn}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {editingUser && (
        <div style={styles.modal}>
          <div style={styles.modalCard}>
            <h2 style={{ marginTop: 0 }}>Edit User</h2>
            <form onSubmit={(e) => {
  e.preventDefault()
  handleUpdate(editingUser._id)
}}>
              <input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Name"
                style={styles.input}
              />
              <input
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                placeholder="Email"
                style={styles.input}
              />
              <div style={styles.modalBtns}>
                <button type="submit" style={styles.saveBtn}>Save</button>
                <button type="button" onClick={() => setEditingUser(null)} style={styles.cancelBtn}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
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
  },
  actionBtns: {
    display: 'flex',
    gap: '8px'
  },
  editBtn: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  deleteBtn: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  modal: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  modalCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '24px',
    width: '100%',
    maxWidth: '420px',
    border: '1px solid #2a2a2a'
  },
  input: {
    width: '100%',
    marginBottom: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #3a3a3a',
    backgroundColor: '#0f0f0f',
    color: '#e5e5e5'
  },
  modalBtns: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '16px'
  },
  saveBtn: {
    backgroundColor: '#22c55e',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  cancelBtn: {
    backgroundColor: '#525252',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600'
  }
}

export default Dashboard