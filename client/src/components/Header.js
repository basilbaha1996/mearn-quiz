import React from 'react';
import { useQuiz } from '../contexts/QuizContext';

function Header() {
  const { user } = useQuiz();

  return (
    <header className='app-header'>
      <img src='logo512.png' alt='React logo' />
      <h1>The React Quiz</h1>
      {user && <p>Welcome, {user.firstName} {user.lastName}</p>}
    </header>
  );
}

export default Header;
