import { useState } from 'react'

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import UserDashboard from './pages/UserDashboard'
import Register from './pages/Register'
import Login from './pages/Login'
import Error404 from './pages/Error404'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedAdminRoutes from './protected-routes/ProtectedAdminRoutes'
import ProtectedUserRoutes from './protected-routes/ProtectedUserRoutes'
import Unauthorized from './pages/Unauthorized'
import Account from './pages/Account'

function App() {

  return (
      <Routes>
        {/* public routes */}
        <Route element={<Login/>} path='/'/>
        <Route element={<Register/>} path='/register'/>
        <Route element={<Unauthorized/>} path='/unauthorized'/>

        {/* 404 */}
        <Route element={<Error404/>} path='*'/>

        {/* Protected User Routes */}
        <Route element={<ProtectedUserRoutes/>}>
          <Route element={<UserDashboard/>} path='user'/>
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedAdminRoutes/>}>
          <Route element={<AdminDashboard/>} path='admin'/>
          <Route element={<Account/>} path='account'/>
        </Route>

      </Routes>
  )
}

export default App
