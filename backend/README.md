<!-- /*
================================================================================
File: src/api/index.js
Description: Centralized Axios configuration. It sets up the base URL and
interceptors for automatically handling access token attachment and refresh logic.
This keeps our API calling logic clean throughout the app.
================================================================================
*/
import axios from 'axios';

const API_URL = 'http://localhost:5111/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true // Important for sending cookies
});

// Request interceptor to add the access token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration and refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // Check for 401 Unauthorized and if it's not a retry request
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { data } = await api.post('/auth/refresh');
                localStorage.setItem('accessToken', data.accessToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, logout user
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
                window.location.href = '/'; // Redirect to login
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;


/*
================================================================================
File: src/context/AuthContext.js
Description: Manages global authentication state, including the user object,
access token, and loading status. Provides login/logout functions to the rest
of the application.
================================================================================
*/
import React, { useState, useEffect, createContext, useMemo } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser && accessToken) {
            try {
                 setUser(JSON.parse(storedUser));
            } catch(e) {
                console.error("Failed to parse user from localStorage", e);
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, [accessToken]);

    const login = (userData, token) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('accessToken', token);
        setUser(userData);
        setAccessToken(token);
    };

    const logout = () => {
        api.post('/auth/logout');
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        setUser(null);
        setAccessToken(null);
    };

    const authContextValue = useMemo(() => ({
        user,
        accessToken,
        isAuthenticated: !!accessToken,
        loading,
        login,
        logout,
    }), [user, accessToken, loading]);

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};


/*
================================================================================
File: src/context/DataContext.js
Description: Manages all application-wide data like skills, stats, and quizzes.
It fetches data upon authentication and provides it to any component that needs it,
avoiding prop drilling.
================================================================================
*/
import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import api from '../api';
import { AuthContext } from './AuthContext';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [skills, setSkills] = useState([]);
    const [stats, setStats] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useContext(AuthContext);

    const fetchData = async () => {
        if (isAuthenticated) {
            setLoading(true);
            try {
                const [skillsRes, statsRes, quizzesRes] = await Promise.all([
                    api.get('/skills'),
                    api.get('/skills/stats'),
                    api.get('/quiz/all')
                ]);
                setSkills(skillsRes.data);
                setStats(statsRes.data);
                setQuizzes(quizzesRes.data.quizzes);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [isAuthenticated]);

    const dataContextValue = useMemo(() => ({
        skills,
        stats,
        quizzes,
        loading,
        fetchData
    }), [skills, stats, quizzes, loading]);

    return (
        <DataContext.Provider value={dataContextValue}>
            {children}
        </DataContext.Provider>
    );
};


/*
================================================================================
File: src/components/ui/Button.js
Description: A general-purpose, reusable Button component with different visual
variants (primary, secondary, danger).
================================================================================
*/
import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) => {
    const baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black';
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed',
        secondary: 'bg-gray-700 text-white hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed',
        danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed',
    };
    return (
        <button type={type} onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`} disabled={disabled}>
            {children}
        </button>
    );
};

export default Button;


/*
================================================================================
File: src/components/ui/Card.js
Description: A reusable Card component for consistent container styling.
================================================================================
*/
import React from 'react';

const Card = ({ children, className = '' }) => (
    <div className={`bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 shadow-lg ${className}`}>
        {children}
    </div>
);

export default Card;


/*
================================================================================
File: src/components/ui/Input.js
Description: A reusable Input component with consistent dark-theme styling.
================================================================================
*/
import React from 'react';

const Input = ({ type = 'text', placeholder, value, onChange, name, className = '' }) => (
    <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        className={`w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
);

export default Input;


/*
================================================================================
File: src/components/ui/Modal.js
Description: A reusable Modal component for displaying content in a dialog overlay.
================================================================================
*/
import React from 'react';
import { XCircle } from 'lucide-react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
                    <XCircle size={24} />
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;


/*
================================================================================
File: src/components/common/Spinner.js
Description: A simple loading spinner component.
================================================================================
*/
import React from 'react';

const Spinner = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
);

export default Spinner;


/*
================================================================================
File: src/components/auth/LoginPage.js
Description: Handles both user login and signup. Toggles between the two forms.
Communicates with the AuthContext to update the user's state upon success.
================================================================================
*/
import React, { useState, useContext } from 'react';
import { LogIn, UserPlus, BrainCircuit } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const endpoint = isLogin ? '/auth/login' : '/auth/signup';
        try {
            const res = await api.post(endpoint, formData);
            login(res.data.user, res.data.accessToken);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
            <div className="text-center mb-8">
                <BrainCircuit size={64} className="mx-auto text-blue-500" />
                <h1 className="text-4xl font-bold mt-4">Skill Logger</h1>
                <p className="text-gray-400">Track your learning, master your skills.</p>
            </div>
            <Card className="w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                {error && <p className="bg-red-500/20 text-red-400 border border-red-500/30 p-3 rounded-lg mb-4 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && <Input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />}
                    <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                    <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                    <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                        {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                    </Button>
                </form>
                <p className="text-center mt-6 text-sm text-gray-400">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => setIsLogin(!isLogin)} className="font-semibold text-blue-500 hover:underline ml-2">
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </Card>
        </div>
    );
};

export default LoginPage;


/*
================================================================================
File: src/components/dashboard/LogSkillForm.js
Description: The form used inside the modal for adding a new skill or editing
an existing one.
================================================================================
*/
import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import api from '../../api';
import Button from '../ui/Button';
import Input from '../ui/Input';

const LogSkillForm = ({ skill, onFormSubmit }) => {
    const [formData, setFormData] = useState({ title: '', description: '', duration: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (skill) {
            setFormData({ title: skill.title, description: skill.description, duration: skill.duration });
        } else {
            setFormData({ title: '', description: '', duration: '' });
        }
    }, [skill]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (skill) {
                await api.put(`/skills/${skill._id}`, formData);
            } else {
                await api.post('/skills/log', formData);
            }
            onFormSubmit();
        } catch (error) {
            console.error("Failed to save skill", error);
            alert('An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">{skill ? 'Edit Skill Log' : 'Log a New Skill'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="title" placeholder="Skill or Topic" value={formData.title} onChange={handleChange} />
                <Input name="description" placeholder="What did you learn?" value={formData.description} onChange={handleChange} />
                <Input name="duration" type="number" placeholder="Duration (in minutes)" value={formData.duration} onChange={handleChange} />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Saving...' : (skill ? 'Update Log' : 'Add Log')} <Send size={18} />
                </Button>
            </form>
        </div>
    );
};

export default LogSkillForm;


/*
================================================================================
File: src/components/dashboard/DashboardPage.js
Description: The main landing page after login. Displays user stats and recent
skill logs. Handles opening the modal for adding/editing skills and deleting skills.
================================================================================
*/
import React, { useState, useContext } from 'react';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { DataContext } from '../../context/DataContext';
import api from '../../api';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import Spinner from '../common/Spinner';
import LogSkillForm from './LogSkillForm';

const DashboardPage = () => {
    const { user } = useContext(AuthContext);
    const { skills, stats, loading, fetchData } = useContext(DataContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);

    const handleEdit = (skill) => {
        setEditingSkill(skill);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this log?')) {
            try {
                await api.delete(`/skills/${id}`);
                fetchData(); // Refresh data
            } catch (error) {
                console.error("Failed to delete skill", error);
                alert('Failed to delete skill.');
            }
        }
    };
    
    const handleFormSubmit = () => {
        setIsModalOpen(false);
        setEditingSkill(null);
        fetchData();
    };

    if (loading && !stats) return <div className="h-full"><Spinner /></div>;

    return (
        <div className="p-4 md:p-8 space-y-8">
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <h3 className="font-bold text-gray-400">Logs This Week</h3>
                    <p className="text-4xl font-bold text-blue-500">{stats?.weeklyCount || 0}</p>
                </Card>
                <Card>
                    <h3 className="font-bold text-gray-400">Logs This Month</h3>
                    <p className="text-4xl font-bold text-green-500">{stats?.monthlyCount || 0}</p>
                </Card>
                <Card className="md:col-span-2">
                     <h3 className="font-bold text-gray-400 mb-2">Monthly Topics</h3>
                     <div className="flex flex-wrap gap-2">
                        {stats?.monthlyTopics?.length > 0 ? stats.monthlyTopics.map(topic => (
                            <span key={topic} className="bg-gray-700 text-xs font-semibold px-2.5 py-1.5 rounded-full">{topic}</span>
                        )) : <p className="text-gray-500">No topics logged this month.</p>}
                     </div>
                </Card>
            </div>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Your Learning Log</h2>
                    <Button onClick={() => { setEditingSkill(null); setIsModalOpen(true); }}>
                        <PlusCircle size={18} /> Log New Skill
                    </Button>
                </div>
                <div className="space-y-4">
                    {skills.length > 0 ? skills.slice(0, 5).map(skill => (
                        <div key={skill._id} className="bg-gray-800/50 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-lg">{skill.title}</h4>
                                <p className="text-gray-400 text-sm">{skill.description}</p>
                                <p className="text-blue-400 font-semibold mt-1">{skill.duration} minutes</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="secondary" onClick={() => handleEdit(skill)}><Edit size={16} /></Button>
                                <Button variant="danger" onClick={() => handleDelete(skill._id)}><Trash2 size={16} /></Button>
                            </div>
                        </div>
                    )) : <p className="text-gray-500 text-center py-4">You haven't logged any skills yet. Get started!</p>}
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <LogSkillForm skill={editingSkill} onFormSubmit={handleFormSubmit} />
            </Modal>
        </div>
    );
};

export default DashboardPage;


/*
================================================================================
File: src/components/quiz/QuizSetupPage.js
Description: The page where users configure a custom quiz or choose to start
a random one.
================================================================================
*/
import React, { useState } from 'react';
import { ChevronsRight } from 'lucide-react';
import api from '../../api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

const QuizSetupPage = ({ setQuizConfig }) => {
    const [config, setConfig] = useState({
        topic: '',
        difficulty: 'medium',
        questionCount: 10,
        timeLimit: 10
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setConfig({ ...config, [e.target.name]: e.target.value });
    };

    const startQuiz = async (isRandom = false) => {
        setLoading(true);
        setError('');
        try {
            const payload = isRandom ? {} : config;
            const res = await api.post('/quiz/start', payload);
            setQuizConfig(res.data.quiz);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to start quiz.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 flex items-center justify-center min-h-full">
            <Card className="w-full max-w-lg">
                <h1 className="text-3xl font-bold text-center mb-2">Test Your Knowledge</h1>
                <p className="text-gray-400 text-center mb-6">Configure your quiz or start a random one based on your logs.</p>
                {error && <p className="bg-red-500/20 text-red-400 border border-red-500/30 p-3 rounded-lg mb-4 text-center">{error}</p>}
                
                <div className="space-y-4 mb-6">
                    <Input name="topic" placeholder="Enter a topic (e.g., React Hooks)" value={config.topic} onChange={handleChange} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-bold text-gray-400 block mb-2">Difficulty</label>
                            <select name="difficulty" value={config.difficulty} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                        <Input name="questionCount" type="number" placeholder="Questions" value={config.questionCount} onChange={handleChange} />
                        <Input name="timeLimit" type="number" placeholder="Time (mins)" value={config.timeLimit} onChange={handleChange} />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <Button onClick={() => startQuiz(false)} className="w-full" disabled={loading}>
                        {loading ? 'Generating...' : 'Start Custom Quiz'} <ChevronsRight size={18} />
                    </Button>
                    <Button onClick={() => startQuiz(true)} variant="secondary" className="w-full" disabled={loading}>
                        {loading ? 'Generating...' : 'Start Random Quiz'} <ChevronsRight size={18} />
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default QuizSetupPage;


/*
================================================================================
File: src/components/quiz/QuizPage.js
Description: The main interface for taking a quiz. Displays one question at a
time, handles user answers, and manages the timer.
================================================================================
*/
import React, { useState, useEffect } from 'react';
import { ChevronsRight, Timer } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

const QuizPage = ({ quiz, onFinish }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : null);
    const currentQuestion = quiz.questions[currentQuestionIndex];

    const finishQuiz = React.useCallback(() => {
        let score = 0;
        quiz.questions.forEach((q, index) => {
            if (answers[index] === q.answer) {
                score++;
            }
        });
        const finalScore = (score / quiz.questions.length) * 100;
        onFinish(finalScore);
    }, [answers, quiz.questions, onFinish]);

    useEffect(() => {
        if (timeLeft === 0) {
            finishQuiz();
        }
        if (timeLeft === null) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, finishQuiz]);

    const handleAnswer = (option) => {
        setAnswers({ ...answers, [currentQuestionIndex]: option });
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            finishQuiz();
        }
    };
    
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="p-4 md:p-8 flex items-center justify-center min-h-full">
            <Card className="w-full max-w-3xl">
                <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold">{quiz.topic} Quiz</h2>
                        <p className="text-gray-400">{quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}</p>
                    </div>
                    {timeLeft !== null && (
                        <div className="flex items-center gap-2 text-red-500 font-bold text-lg">
                            <Timer size={20} />
                            <span>{formatTime(timeLeft)}</span>
                        </div>
                    )}
                </div>
                
                <div className="mb-6">
                    <p className="text-gray-400 mb-4">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
                    <h3 className="text-2xl font-semibold">{currentQuestion.question}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options.map(option => (
                        <button
                            key={option}
                            onClick={() => handleAnswer(option)}
                            className={`p-4 rounded-lg text-left transition-all duration-200 border-2 ${
                                answers[currentQuestionIndex] === option 
                                ? 'bg-blue-600 border-blue-500' 
                                : 'bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600'
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                <div className="mt-8 text-right">
                    <Button onClick={nextQuestion} disabled={!answers[currentQuestionIndex]}>
                        {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                        <ChevronsRight size={18} />
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default QuizPage;


/*
================================================================================
File: src/components/quiz/QuizResultPage.js
Description: Displays the user's final score after completing a quiz and submits
the score to the backend.
================================================================================
*/
import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import api from '../../api';
import Button from '../ui/Button';
import Card from '../ui/Card';

const QuizResultPage = ({ quiz, score, onRestart }) => {
    const resultMessage = score >= 80 ? "Excellent Work!" : score >= 60 ? "Good Job!" : "Keep Practicing!";
    const messageColor = score >= 80 ? "text-green-500" : score >= 60 ? "text-yellow-500" : "text-red-500";

    useEffect(() => {
        api.patch(`/quiz/${quiz._id}/result`, { score }).catch(err => console.error("Failed to submit score", err));
    }, [quiz._id, score]);

    return (
        <div className="p-4 md:p-8 flex items-center justify-center min-h-full">
            <Card className="w-full max-w-lg text-center">
                <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
                <p className={`text-2xl font-bold mb-4 ${messageColor}`}>{resultMessage}</p>
                <div className="text-7xl font-bold my-8">{Math.round(score)}<span className="text-3xl text-gray-400">%</span></div>
                <p className="text-gray-400">You answered {Math.round(score/100 * quiz.questions.length)} out of {quiz.questions.length} questions correctly.</p>
                <Button onClick={onRestart} className="mt-8 mx-auto">
                    <ArrowLeft size={18} /> Take Another Quiz
                </Button>
            </Card>
        </div>
    );
};

export default QuizResultPage;


/*
================================================================================
File: src/components/common/AppContent.js
Description: The main layout component after a user is authenticated. It contains
the navigation bar and acts as a router to display the correct page (Dashboard,
Quiz Setup, Quiz Page, etc.) based on the application's state.
================================================================================
*/
import React, { useState, useContext } from 'react';
import { BookOpen, BarChart2, BrainCircuit, LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import Button from '../ui/Button';
import DashboardPage from '../dashboard/DashboardPage';
import QuizSetupPage from '../quiz/QuizSetupPage';
import QuizPage from '../quiz/QuizPage';
import QuizResultPage from '../quiz/QuizResultPage';
import Spinner from './Spinner';
import LoginPage from '../auth/LoginPage';

const AppContent = () => {
    const { isAuthenticated, loading, logout } = useContext(AuthContext);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [quizConfig, setQuizConfig] = useState(null);
    const [quizResult, setQuizResult] = useState(null);
    
    const navigate = (page) => {
        setQuizConfig(null);
        setQuizResult(null);
        setCurrentPage(page);
    };

    const handleFinishQuiz = (score) => {
        setQuizResult({ quiz: quizConfig, score });
        setQuizConfig(null);
    };

    if (loading) {
        return <div className="bg-black min-h-screen"><Spinner /></div>;
    }

    if (!isAuthenticated) {
        return <LoginPage />;
    }
    
    const renderPage = () => {
        if (quizConfig) {
            return <QuizPage quiz={quizConfig} onFinish={handleFinishQuiz} />;
        }
        if (quizResult) {
            return <QuizResultPage quiz={quizResult.quiz} score={quizResult.score} onRestart={() => navigate('quiz')} />;
        }
        switch (currentPage) {
            case 'dashboard':
                return <DashboardPage />;
            case 'quiz':
                return <QuizSetupPage setQuizConfig={setQuizConfig} />;
            default:
                return <DashboardPage />;
        }
    };

    return (
        <div className="bg-black text-white min-h-screen">
            <nav className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 p-4 flex justify-between items-center sticky top-0 z-40">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('dashboard')}>
                    <BrainCircuit className="text-blue-500" />
                    <h1 className="font-bold text-xl">Skill Logger</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('dashboard')} className="flex items-center gap-2 hover:text-blue-400 transition-colors"><BarChart2 size={18}/>Dashboard</button>
                    <button onClick={() => navigate('quiz')} className="flex items-center gap-2 hover:text-blue-400 transition-colors"><BookOpen size={18}/>Quiz</button>
                    <Button onClick={logout} variant="secondary"><LogOut size={18}/>Logout</Button>
                </div>
            </nav>
            <main className="h-[calc(100vh-68px)] overflow-y-auto">
                {renderPage()}
            </main>
        </div>
    );
};

export default AppContent;


/*
================================================================================
File: src/App.js
Description: The main entry point for the React application. It wraps the entire
app with the Auth and Data context providers so that all components can access
global state.
================================================================================
*/
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import AppContent from './components/common/AppContent';

function App() {
    return (
        <AuthProvider>
            <DataProvider>
                <AppContent />
            </DataProvider>
        </AuthProvider>
    );
}

export default App; -->
