import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { BookOpen, Stars, Sparkles } from 'lucide-react';
import { LoginForm } from './LoginForm';

interface WelcomeScreenProps {
  onLogin: () => void;
}

export function WelcomeScreen({ onLogin }: WelcomeScreenProps) {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 20 },
  });

  const float = useSpring({
    from: { transform: 'translateY(0px)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'translateY(-10px)' });
        await next({ transform: 'translateY(0px)' });
      }
    },
    config: { tension: 100, friction: 10 },
  });

  return (
    <animated.div 
      style={fadeIn}
      className="min-h-screen bg-background flex flex-col items-center justify-center p-4"
    >
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <animated.div style={float} className="flex justify-center">
            <div className="bg-accent rounded-full p-6 shadow-xl">
              <BookOpen className="w-16 h-16 text-primary" />
            </div>
          </animated.div>
          <h1 className="mt-6 text-4xl font-bold text-gray-900">
            Magical Stories
          </h1>
          <p className="mt-2 text-xl text-gray-600">
            Begin Your Adventure!
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-4xl shadow-xl border-4 border-secondary">
          <LoginForm onSuccess={onLogin} />
        </div>

        <div className="absolute top-10 left-10 animate-float">
          <Stars className="w-8 h-8 text-accent" />
        </div>
        <div className="absolute bottom-10 right-10 animate-bounce-slow">
          <Sparkles className="w-8 h-8 text-secondary" />
        </div>
      </div>
    </animated.div>
  );
}