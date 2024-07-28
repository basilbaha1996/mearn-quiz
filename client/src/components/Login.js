import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';

const Login = ({ setAuthToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { fetchQuestions } = useQuiz();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('/api/users/login', { email, password });
            if (res && res.data && res.data.token) {
                const token = res.data.token;
                setAuthToken(token);
                localStorage.setItem('authToken', token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                await fetchQuestions();
                setSuccess(true);
                setLoading(false);
                setTimeout(() => navigate('/quiz'), 1000);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'An unexpected error occurred. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <h2>Login</h2>
            {error && <div style={messageStyle}>{error}</div>}
            {loading ? (
                <div>Loading...</div>
            ) : success ? (
                <div>Login successful! Redirecting...</div>
            ) : (
                <>
                    <input
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                    />
                    <input
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                    />
                    <button type='submit' style={buttonStyle}>Login</button>
                </>
            )}
        </form>
    );
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
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
    color: 'red',
    marginBottom: '10px',
};

export default Login;
