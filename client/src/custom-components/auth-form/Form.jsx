import React, { useState } from 'react';
import "./AuthFormStyles.css"
import { useUser } from '../../context/UserContext';

const AuthForm = () => {
    const { loginUser, registerUser } = useUser();
    //! LOGIN -------------------
    const [loginFormData, setLoginFormData] = useState({
        username: '',
        password: '',
    });
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginFormData({ ...loginFormData, [name]: value });
    };
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        loginUser(loginFormData)
    };
    //! REGISTER -------------------
    const [registerFormData, setRegisterFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterFormData({ ...registerFormData, [name]: value });
    };
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (registerFormData.password !== registerFormData.confirmPassword) {
            alert("passwords do not match")
            return
        }
        registerUser(registerFormData)
    };
    return (
        <div className="main">
            <input type="checkbox" id="chk" aria-hidden="true" />

            <div className="login">
                <form className="form" onSubmit={handleLoginSubmit}>
                    <label htmlFor="chk" aria-hidden="true">Log in</label>
                    <input className="input" type="text" name="username" placeholder="Username" required
                        onChange={handleLoginChange}
                        value={loginFormData.username}
                    />
                    <input className="input" placeholder="Password" type="password" name="password" required
                        value={loginFormData.password}
                        onChange={handleLoginChange}
                    />
                    <button type="submit">Login</button>
                </form>
            </div>

            <div className="register">
                <form className="form" onSubmit={handleRegisterSubmit}>
                    <label htmlFor="chk" aria-hidden="true">Register</label>
                    <input onChange={handleRegisterChange} value={registerFormData.username} className="input" type="text" name="username" placeholder="Username" required />
                    <input onChange={handleRegisterChange} value={registerFormData.email} className="input" type="email" name="email" placeholder="Email" required />
                    <input onChange={handleRegisterChange} value={registerFormData.password} className="input" type="password" name="password" placeholder="Password" required />
                    <input onChange={handleRegisterChange} value={registerFormData.confirmPassword} className="input" type="password" name="confirmPassword" placeholder="Password" required />
                    <button type='submit'>Register</button>
                </form>
            </div>
        </div>
    );
};

export default AuthForm;
