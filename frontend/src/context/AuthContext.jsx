import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../api/auth.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('sendbox_token')
    if (token) {
      authAPI.getMe()
        .then(res => setUser(res.data.data))
        .catch(() => {
          localStorage.removeItem('sendbox_token')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback((token, userData) => {
    localStorage.setItem('sendbox_token', token)
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('sendbox_token')
    setUser(null)
  }, [])

  const updateUser = useCallback(u => setUser(u), [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be within AuthProvider')
  return ctx
}