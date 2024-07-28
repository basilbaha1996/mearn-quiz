import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/users/register', { firstName, lastName, email, password });
            console.log(res.data.message);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000); // Redirect to login after 3 seconds
        } catch (err) {
            console.error(err.response.data.message);
            setError(err.response.data.message);
        }
    };

    const handleGoToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="form-container">
            <h1 className="header-title">Welcome to the Quiz App</h1>
            <p className="header-subtitle">
                Join our community of learners and test your knowledge with our fun and engaging quizzes.
                Registering is quick and easy, and it gives you access to track your progress and compete with friends.
            </p>
            <div className="form-card">
                {success ? (
                    <div className="form-message" style={{ color: 'green' }}>Registration successful! Redirecting to login...</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <h2>Register</h2>
                        {error && <div className="form-message">{error}</div>}
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="form-input"
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="form-input"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                        />
                        <button type="submit" className="btn">Register</button>
                    </form>
                )}
                <p className="switch-text">If you already have an account, you can</p>
                <button onClick={handleGoToLogin} className="btn">Go to Login</button>
            </div>
        </div>
    );
};

export default Register;
