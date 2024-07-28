import React from 'react';
import { useQuiz } from '../contexts/QuizContext';
import { useNavigate } from 'react-router-dom';

function Header() {
  const { user, dispatch } = useQuiz();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'logout' });
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <header className='app-header'>
      <img src='logo512.png' alt='React logo' />
      <h1>The React Quiz</h1>
      {user && (
        <div>
          <p>Welcome, {user.firstName} {user.lastName}</p>
          <button className="btn btn-ui" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </header>
  );
}

export default Header;
