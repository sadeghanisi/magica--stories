import React, { useState } from 'react';
import { useSpring, animated, useTrail } from '@react-spring/web';
import { ArrowLeftCircle, Volume2, Volume1, BookOpen, Sparkles } from 'lucide-react';
import { Story } from '../types';

interface StoryReaderProps {
  story: Story;
  onClose: () => void;
}

export function StoryReader({ story, onClose }: StoryReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [volume, setVolume] = useState('normal');
  const [highlightedWord, setHighlightedWord] = useState('');

  // Companion character animation
  const companionSpring = useSpring({
    y: isReading ? -10 : 0,
    loop: true,
    config: { tension: 180, friction: 12 },
  });

  // Page transition animation
  const pageTransition = useSpring({
    from: { opacity: 0, transform: 'translateX(100%)' },
    to: { opacity: 1, transform: 'translateX(0%)' },
    reset: true,
    key: currentPage,
  });

  // Text animation
  const words = story.pages[currentPage].text.split(' ');
  const trail = useTrail(words.length, {
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    reset: true,
    key: currentPage,
  });

  // Progress caterpillar segments
  const totalSegments = story.pages.length;
  const progressSegments = Array.from({ length: totalSegments }, (_, i) => ({
    filled: i <= currentPage,
  }));

  const handleWordClick = (word: string) => {
    setHighlightedWord(word);
    // Simulate word pronunciation
    const utterance = new SpeechSynthesisUtterance(word);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-accent-light to-primary-light p-4">
      <div className="h-full max-w-7xl mx-auto bg-white rounded-4xl shadow-2xl overflow-hidden relative">
        {/* Top Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10">
          <button
            onClick={onClose}
            className="flex items-center space-x-2 text-primary hover:text-primary-light transition-colors"
          >
            <ArrowLeftCircle className="w-10 h-10" />
            <span className="text-xl font-bold">Back to Stories</span>
          </button>

          {/* Caterpillar Progress Bar */}
          <div className="flex items-center space-x-2">
            {progressSegments.map((segment, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full transition-colors duration-300 ${
                  segment.filled
                    ? 'bg-secondary animate-bounce-slow'
                    : 'bg-gray-200'
                }`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {segment.filled && (
                  <div className="w-2 h-2 bg-white rounded-full ml-1 mt-1" />
                )}
              </div>
            ))}
          </div>

          {/* Reading Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsReading(!isReading)}
              className="p-3 rounded-full bg-accent hover:bg-accent-light transition-colors"
            >
              <BookOpen className="w-8 h-8 text-primary" />
            </button>
            <button
              onClick={() => setVolume(volume === 'normal' ? 'soft' : 'normal')}
              className="p-3 rounded-full bg-accent hover:bg-accent-light transition-colors"
            >
              {volume === 'normal' ? (
                <Volume2 className="w-8 h-8 text-primary" />
              ) : (
                <Volume1 className="w-8 h-8 text-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <animated.div
          style={pageTransition}
          className="h-full pt-24 grid grid-cols-2 gap-8 p-8"
        >
          {/* Story Text Side */}
          <div className="relative">
            <div className="prose prose-lg max-w-none space-y-6">
              {trail.map((style, index) => (
                <animated.span
                  key={index}
                  style={style}
                  onClick={() => handleWordClick(words[index])}
                  className={`inline-block mr-2 text-3xl leading-relaxed cursor-pointer
                    ${
                      words[index] === highlightedWord
                        ? 'text-secondary animate-pulse'
                        : 'text-gray-800 hover:text-primary'
                    }
                    transition-colors duration-200`}
                >
                  {words[index]}
                </animated.span>
              ))}
            </div>

            {/* Reading Companion */}
            <animated.div
              style={companionSpring}
              className="absolute bottom-8 right-8 w-32"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1589652717521-10c0d092dea9?auto=format&fit=crop&q=80&w=200"
                  alt="Friendly owl companion"
                  className="w-full h-auto rounded-full border-4 border-accent shadow-lg"
                />
                {isReading && (
                  <div className="absolute -top-16 right-0 bg-white rounded-2xl p-4 shadow-lg">
                    <p className="text-lg font-comic">Let's read together!</p>
                    <Sparkles className="absolute bottom-2 right-2 w-4 h-4 text-accent animate-spin" />
                  </div>
                )}
              </div>
            </animated.div>
          </div>

          {/* Illustration Side */}
          <div className="relative rounded-3xl overflow-hidden border-4 border-accent shadow-xl">
            <img
              src={story.pages[currentPage].image}
              alt="Story illustration"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </animated.div>

        {/* Navigation Arrows */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-8">
          <button
            onClick={() => currentPage > 0 && setCurrentPage(p => p - 1)}
            disabled={currentPage === 0}
            className={`transform transition-transform hover:scale-110 ${
              currentPage === 0 ? 'opacity-50' : ''
            }`}
          >
            <img
              src="https://images.unsplash.com/photo-1590005354167-6da97870c757?auto=format&fit=crop&q=80&w=50"
              alt="Previous page"
              className="w-16 h-16 rounded-full border-4 border-secondary shadow-lg"
            />
          </button>
          <button
            onClick={() => currentPage < story.pages.length - 1 && setCurrentPage(p => p + 1)}
            disabled={currentPage === story.pages.length - 1}
            className={`transform transition-transform hover:scale-110 ${
              currentPage === story.pages.length - 1 ? 'opacity-50' : ''
            }`}
          >
            <img
              src="https://images.unsplash.com/photo-1590005354167-6da97870c757?auto=format&fit=crop&q=80&w=50"
              alt="Next page"
              className="w-16 h-16 rounded-full border-4 border-secondary shadow-lg"
            />
          </button>
        </div>
      </div>
    </div>
  );
}