import { useEffect, useState } from 'react'

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import UserDashboard from './pages/UserDashboard'
import Register from './pages/Register'
import Login from './pages/Login'
import Error404 from './pages/Error404'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedAdminRoutes from './protected-routes/ProtectedAdminRoutes'
import ProtectedUserRoutes from './protected-routes/ProtectedUserRoutes'
import Unauthorized from './pages/Unauthorized'
import Account from './pages/Account'
import { ThemeProvider } from 'styled-components'
import Avatars from './components/user/avatars/Avatars'
import Profile from './components/user/profile/Profile'

function App() {
  const [theme, settheme] = useState({})
  const location = useLocation()
  useEffect(() => {
    localStorage.setItem('location', location.pathname)
    console.log(location.pathname)

  }, [location])
  
  
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        {/* public routes */}
        <Route element={<Login />} path='/' />
        <Route element={<Register />} path='/register' />
        <Route element={<Unauthorized />} path='/unauthorized' />

        {/* 404 */}
        <Route element={<Error404 />} path='*' />

        {/* Protected User Routes */}
        <Route element={<ProtectedUserRoutes />}>
          <Route element={<Avatars />} path='avatars' />
          <Route element={<UserDashboard />} path='user'/>
          <Route element={<Profile/>} path='profile'/>
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedAdminRoutes />}>
          <Route element={<Avatars />} path='avatars' />
          <Route element={<AdminDashboard />} path='admin' />
          <Route element={<Account />} path='account' />
        </Route>

      </Routes>
    </ThemeProvider>
  )
}

export default App
