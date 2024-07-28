import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishScreen from './FinishScreen';
import Footer from './Footer';
import Timer from './Timer';
import { useQuiz, QuizProvider } from '../contexts/QuizContext';
import Register from './Register';
import Login from './Login';
import axios from 'axios';
import '../index.css';

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('authToken', authToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    } else {
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [authToken]);

  return (
    <QuizProvider>
      <Router>
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login setAuthToken={setAuthToken} />} />
          {authToken ? (
            <Route path='/quiz' element={<QuizApp />} />
          ) : (
            <Route path='*' element={<Navigate to='/register' />} />
          )}
        </Routes>
      </Router>
    </QuizProvider>
  );
};

const QuizApp = () => {
  const { status } = useQuiz();

  return (
    <div className="app">
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && <StartScreen />}
        {status === 'active' && (
          <>
            <Progress />
            <Question />
            <Footer>
              <Timer />
              <NextButton />
            </Footer>
          </>
        )}
        {status === 'finished' && <FinishScreen />}
      </Main>
    </div>
  );
};

export default App;
