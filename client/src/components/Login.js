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
    const { fetchQuestions, dispatch } = useQuiz();

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
                dispatch({ type: 'setUser', payload: res.data.user }); // Set user data in context
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

    const handleGoToRegister = () => {
        navigate('/register');
    };

    return (
        <div className="form-container">
            <div className="form-card">
                <h2>Login</h2>
                {error && <div className="form-message">{error}</div>}
                {loading ? (
                    <div>Loading...</div>
                ) : success ? (
                    <div className="form-message" style={{ color: 'green' }}>Login successful! Redirecting...</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <input
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                        />
                        <input
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                        />
                        <button type='submit' className="btn">Login</button>
                    </form>
                )}
                <p className="switch-text">If you don't have an account, you can</p>
                <button onClick={handleGoToRegister} className="btn">Go to Register</button>
            </div>
        </div>
    );
};

export default Login;
