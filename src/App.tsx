import React from 'react';
import { Book, UserCircle, LogOut } from 'lucide-react';
import { stories } from './data/stories';
import { WelcomeScreen } from './components/WelcomeScreen';
import { StoriesGrid } from './components/StoriesGrid';
import { StoryReader } from './components/StoryReader';
import { ProfileSettings } from './components/ProfileSettings';
import { useAuth } from './hooks/useAuth';
import type { Story } from './types';

function App() {
  const { user, logout } = useAuth();
  const [selectedStory, setSelectedStory] = React.useState<Story | null>(null);
  const [showSettings, setShowSettings] = React.useState(false);

  if (!user) {
    return <WelcomeScreen onLogin={() => {}} />;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Book className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Magical Stories
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="btn-secondary"
              >
                <UserCircle className="w-5 h-5 mr-2" />
                Profile Settings
              </button>
              <button
                onClick={handleLogout}
                className="btn-primary"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {showSettings ? (
          <ProfileSettings />
        ) : (
          <StoriesGrid
            stories={stories}
            onSelectStory={setSelectedStory}
          />
        )}
      </main>

      {selectedStory && (
        <StoryReader
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </div>
  );
}

export default App;