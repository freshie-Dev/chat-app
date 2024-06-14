import React from 'react'
import { Link } from 'react-router-dom'

const AdminDashboard = () => {
  return (
    <div>
      <h1>AdminDashboard</h1>
      <Link to='/account'>Go to account</Link>
    </div>

  )
}

export default AdminDashboard