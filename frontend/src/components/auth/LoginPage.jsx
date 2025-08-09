import React, { useState, useContext } from 'react';
import { LogIn, UserPlus, BrainCircuit } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

// --- 1. Define the component ---
const LoginPage = () => {
    // --- 2. Set up component state ---
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // --- 3. Access the login function from our context ---
    const { login } = useContext(AuthContext);

    // --- 4. Handle changes in the input fields ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- 5. Handle the form submission ---
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the browser from reloading the page
        setLoading(true);
        setError('');
        const endpoint = isLogin ? '/auth/login' : '/auth/signup';
        try {
            const res = await api.post(endpoint, formData);
            login(res.data.user, res.data.accessToken); // Call the login function from AuthContext
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    // --- 6. Render the JSX for the UI ---
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