import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import type { AuthError } from 'firebase/auth';

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('Sadegh@unm.edu');
  const [password, setPassword] = useState('Sadegh1993');

  const shake = useSpring({
    transform: error ? 'translateX(0px)' : 'translateX(0px)',
    config: {
      tension: 300,
      friction: 10,
    },
    onChange: {
      transform: (value: string) => {
        if (error) {
          const sequence = [0, -20, 20, -20, 20, 0];
          const index = Math.floor((Date.now() % 600) / 100);
          return `translateX(${sequence[index]}px)`;
        }
        return value;
      },
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      onSuccess();
    } catch (err: unknown) {
      const authError = err as AuthError;
      setError(authError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <animated.form
      style={shake}
      onSubmit={handleSubmit}
      className="mt-8 space-y-6"
    >
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
            placeholder="Enter your password"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full flex items-center justify-center"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          isSignup ? 'Sign Up' : 'Log In'
        )}
      </button>

      <button
        type="button"
        onClick={() => setIsSignup(!isSignup)}
        className="w-full text-sm text-primary hover:text-primary-light transition-colors"
      >
        {isSignup ? 'Already have an account? Log in' : 'Need an account? Sign up'}
      </button>
    </animated.form>
  );
}