import React from 'react';
import { useTrail, animated } from '@react-spring/web';
import { StoryCard } from './StoryCard';
import { Story } from '../types';

interface StoriesGridProps {
  stories: Story[];
  onSelectStory: (story: Story) => void;
}

export function StoriesGrid({ stories, onSelectStory }: StoriesGridProps) {
  const trail = useTrail(stories.length, {
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { tension: 280, friction: 20 },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {trail.map((style, index) => (
        <animated.div key={stories[index].id} style={style}>
          <StoryCard
            story={stories[index]}
            onClick={() => onSelectStory(stories[index])}
          />
        </animated.div>
      ))}
    </div>
  );
}