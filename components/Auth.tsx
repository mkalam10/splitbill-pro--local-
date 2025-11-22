import React, { useState } from 'react';
import { User } from '../types';
import * as authService from '../services/authService';

interface AuthProps {
    onLoginSuccess: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            let user: User;
            if (isLoginView) {
                user = await authService.login(email, password);
            } else {
                user = await authService.register(name, email, password);
            }
            onLoginSuccess(user);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const toggleView = () => {
        setIsLoginView(!isLoginView);
        setError(null);
        setName('');
        setEmail('');
        setPassword('');
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
             <div className="flex items-center space-x-3 mb-8">
                <i className="fa-solid fa-receipt text-4xl text-green-500"></i>
                <h1 className="text-4xl font-bold text-gray-900">SplitBill Pro</h1>
            </div>
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-center text-green-600 mb-6">{isLoginView ? 'Welcome Back!' : 'Create Account'}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLoginView && (
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                             className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password"className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                             className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-wait flex items-center justify-center"
                    >
                        {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : (isLoginView ? 'Login' : 'Register')}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-6">
                    {isLoginView ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={toggleView} className="font-semibold text-green-600 hover:text-green-700 ml-1">
                        {isLoginView ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
             <footer className="text-center mt-12 text-gray-500 text-sm">
                <p>Powered by Gemini API. Built with React & TypeScript.</p>
            </footer>
        </div>
    );
};

export default Auth;
