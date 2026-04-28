import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import PageLoader from './components/ui/PageLoader.jsx'
import DashboardShell from './components/layout/DashboardShell.jsx'
import PWAInstallPrompt from './components/PWAInstallPrompt.jsx'

// All pages lazy loaded for performance
const Landing      = lazy(() => import('./pages/Landing.jsx'))
const Login        = lazy(() => import('./pages/Login.jsx'))
const Register     = lazy(() => import('./pages/Register.jsx'))
const ForgotPass   = lazy(() => import('./pages/ForgotPassword.jsx'))
const Dashboard    = lazy(() => import('./pages/Dashboard.jsx'))
const Connections  = lazy(() => import('./pages/Connections.jsx'))
const Files        = lazy(() => import('./pages/Files.jsx'))
const Notifications = lazy(() => import('./pages/Notifications.jsx'))
const Settings     = lazy(() => import('./pages/Settings.jsx'))

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  return user ? children : <Navigate to="/login" replace />
}

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  return user ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <>
      <PWAInstallPrompt />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPass /></PublicRoute>} />

          <Route path="/dashboard" element={<ProtectedRoute><DashboardShell /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="connections" element={<Connections />} />
            <Route path="files" element={<Files />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}