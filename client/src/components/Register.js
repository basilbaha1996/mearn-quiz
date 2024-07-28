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

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        borderRadius: '8px',
    };

    const inputStyle = {
        marginBottom: '10px',
        padding: '10px',
        width: '80%',
        maxWidth: '400px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '5px',
    };

    const buttonStyle = {
        padding: '10px 20px',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    };

    const messageStyle = {
        color: success ? 'green' : 'red',
        marginBottom: '10px',
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
        padding: '20px',
    };

    const headerStyle = {
        marginBottom: '20px',
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#333',
    };

    const subHeaderStyle = {
        marginBottom: '20px',
        fontSize: '18px',
        color: '#666',
        textAlign: 'center',
        maxWidth: '600px',
    };

    return (
        <div style={containerStyle}>
            <h1 style={headerStyle}>Welcome to the Quiz App</h1>
            <p style={subHeaderStyle}>
                Join our community of learners and test your knowledge with our fun and engaging quizzes.
                Registering is quick and easy, and it gives you access to track your progress and compete with friends.
            </p>
            <div style={formStyle}>
                {success ? (
                    <div style={messageStyle}>Registration successful! Redirecting to login...</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <h2>Register</h2>
                        {error && <div style={messageStyle}>{error}</div>}
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            style={inputStyle}
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            style={inputStyle}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                        />
                        <button type="submit" style={buttonStyle}>Register</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Register;
