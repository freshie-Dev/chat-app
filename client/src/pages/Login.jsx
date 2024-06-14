import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const { user, loginUser } = useUser();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    loginUser(formData)
  };


  

  if (user) {
    if (user.type === 'user') {
        console.log("user running")
        return <Navigate to="user" />;
    } else if (user.type === 'admin') {
        console.log("admin running")
      return <Navigate to="admin" />;
    }
  }
  console.log(user)

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <Link to='/register'>Create an Account</Link>
    </div>
  );
};

export default Login;
