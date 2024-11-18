import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
  AuthError
} from 'firebase/auth';
import { auth } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      const error = err as AuthError;
      let message = 'An error occurred during sign up';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'This email is already registered. Please try logging in instead.';
          break;
        case 'auth/invalid-email':
          message = 'Please enter a valid email address.';
          break;
        case 'auth/operation-not-allowed':
          message = 'Email/password accounts are not enabled. Please contact support.';
          break;
        case 'auth/weak-password':
          message = 'Please choose a stronger password (at least 6 characters).';
          break;
        case 'auth/network-request-failed':
          message = 'Network error. Please check your connection.';
          break;
      }
      
      error.message = message;
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      const error = err as AuthError;
      let message = 'An error occurred during login';
      
      switch (error.code) {
        case 'auth/invalid-email':
          message = 'Please enter a valid email address.';
          break;
        case 'auth/user-disabled':
          message = 'This account has been disabled. Please contact support.';
          break;
        case 'auth/user-not-found':
          message = 'No account found with this email. Please sign up first.';
          break;
        case 'auth/wrong-password':
          message = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-credential':
          message = 'Invalid login credentials. Please check your email and password.';
          break;
        case 'auth/network-request-failed':
          message = 'Network error. Please check your connection.';
          break;
      }
      
      error.message = message;
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      const error = err as AuthError;
      let message = 'An error occurred during logout';
      
      if (error.code === 'auth/network-request-failed') {
        message = 'Network error. Please check your connection.';
      }
      
      error.message = message;
      throw error;
    }
  };

  return {
    user,
    loading,
    signup,
    login,
    logout
  };
}