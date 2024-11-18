import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Story } from '../types';

interface StoryCardProps {
  story: Story;
  onClick: () => void;
}

export function StoryCard({ story, onClick }: StoryCardProps) {
  const [spring, api] = useSpring(() => ({
    scale: 1,
    rotate: 0,
  }));

  const handleHover = (isHovered: boolean) => {
    api.start({
      scale: isHovered ? 1.05 : 1,
      rotate: isHovered ? 2 : 0,
      config: { tension: 300, friction: 10 },
    });
  };

  return (
    <animated.div
      style={spring}
      className="group cursor-pointer bg-white rounded-4xl overflow-hidden shadow-lg border-4 border-secondary p-3"
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      onClick={onClick}
    >
      <div className="relative rounded-3xl overflow-hidden">
        <img
          src={story.coverImage}
          alt={story.title}
          className="w-full h-48 object-cover transform transition-transform group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
      </div>
      <div className="p-4">
        <h3 className="text-2xl font-bold text-gray-800 text-center">
          {story.title}
        </h3>
      </div>
    </animated.div>
  );
}