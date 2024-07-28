import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const QuizContext = createContext();

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  status: 'idle', // Initial state is 'idle'
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
  user: loadUserFromSessionStorage(), // Load user from sessionStorage
};

function loadUserFromSessionStorage() {
  try {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
}

function loadStateFromSessionStorage() {
  try {
    const state = sessionStorage.getItem('quizState');
    return state ? JSON.parse(state) : {};
  } catch (e) {
    return {};
  }
}

function reducer(state, action) {
  console.log('Reducer received action:', action); // Log the action
  switch (action.type) {
    case 'dataReceived':
      console.log('Data received:', action.payload); // Log data received
      return {
        ...state,
        questions: Array.isArray(action.payload) ? action.payload : [],
        status: 'ready',
      };
    case 'dataFailed':
      console.log('Data fetch failed'); // Log data fetch failure
      return {
        ...state,
        status: 'error',
      };
    case 'start':
      console.log('Starting quiz'); // Log when starting
      return {
        ...state,
        status: 'active',
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case 'newAnswer':
      const question = state.questions[state.index];
      console.log('New answer:', action.payload); // Log new answer
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case 'nextQuestion':
      console.log('Next question'); // Log next question
      return { ...state, index: state.index + 1, answer: null };
    case 'finish':
      console.log('Finishing quiz'); // Log finishing quiz
      return {
        ...state,
        status: 'finished',
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case 'restart':
      console.log('Restarting quiz'); // Log restarting quiz
      return { ...initialState, questions: state.questions, status: 'ready' };
    case 'tick':
      console.log('Tick', state.secondsRemaining - 1); // Log tick
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? 'finished' : state.status,
      };
    case 'setUser':
      console.log('Setting user:', action.payload); // Log user
      sessionStorage.setItem('user', JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
      };
    case 'loadState':
      console.log('Loading state from session storage:', action.payload);
      return {
        ...state,
        ...action.payload,
      };
    case 'logout':
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('quizState');
      return { ...initialState };
    default:
      throw new Error('Unknown action type');
  }
}

function QuizProvider({ children }) {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining, user },
    dispatch,
  ] = useReducer(reducer, { ...initialState, ...loadStateFromSessionStorage() });

  const numQuestions = Array.isArray(questions) ? questions.length : 0;
  const maxPossiblePoints = Array.isArray(questions)
    ? questions.reduce((prev, cur) => prev + cur.points, 0)
    : 0;

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }
      const res = await axios.get('/api/questions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ type: 'dataReceived', payload: res.data });
    } catch (err) {
      dispatch({ type: 'dataFailed' });
    }
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }
      const res = await axios.get('/api/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('User fetched:', res.data); // Log fetched user data
      dispatch({ type: 'setUser', payload: res.data });
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  };

  useEffect(() => {
    const savedState = loadStateFromSessionStorage();
    if (Object.keys(savedState).length > 0) {
      dispatch({ type: 'loadState', payload: savedState });
    }
  }, []);

  useEffect(() => {
    const stateToSave = {
      questions,
      status,
      index,
      answer,
      points,
      highscore,
      secondsRemaining,
      user,
    };
    sessionStorage.setItem('quizState', JSON.stringify(stateToSave));
  }, [questions, status, index, answer, points, highscore, secondsRemaining, user]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchQuestions();
      fetchUser();
    }
  }, []);

  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        numQuestions,
        maxPossiblePoints,
        user,
        dispatch,
        fetchQuestions,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) throw new Error('useQuiz must be used within a QuizProvider');
  return context;
}

export { QuizProvider, useQuiz };
