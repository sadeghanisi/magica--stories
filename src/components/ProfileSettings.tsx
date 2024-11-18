import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Save, Settings2, Bell, Type, Clock3, Moon, Sun, BookOpen } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useFirestoreContext } from '../contexts/FirestoreContext';
import { useAuth } from '../hooks/useAuth';
import type { ChildProfile, AppSettings, EthnicityCategory } from '../types';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  fontSize: 'medium',
  fontFamily: 'comic-sans',
  notifications: true,
  readingSpeed: 'medium',
};

const DEFAULT_PROFILE: ChildProfile = {
  name: '',
  age: 5,
  ethnicity: 'prefer-not-to-say',
};

const ETHNICITY_OPTIONS: { value: EthnicityCategory; label: string }[] = [
  { value: 'hispanic-latino', label: 'Hispanic or Latino' },
  { value: 'white', label: 'White' },
  { value: 'black-african-american', label: 'Black or African American' },
  { value: 'american-indian-alaska-native', label: 'American Indian or Alaska Native' },
  { value: 'asian', label: 'Asian' },
  { value: 'native-hawaiian-pacific-islander', label: 'Native Hawaiian or Other Pacific Islander' },
  { value: 'two-or-more-races', label: 'Two or More Races' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

export function ProfileSettings() {
  const { user } = useAuth();
  const { theme, fontFamily, fontSize, setTheme, setFontFamily, setFontSize } = useTheme();
  const { profiles, settings } = useFirestoreContext();
  const [profile, setProfile] = useState<ChildProfile>(DEFAULT_PROFILE);
  const [appSettings, setAppSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.uid) return;

      try {
        const profileData = await profiles.getDocument(user.uid);
        const settingsData = await settings.getDocument(user.uid);

        if (profileData) {
          setProfile(profileData as ChildProfile);
        }
        if (settingsData) {
          setAppSettings(settingsData as AppSettings);
          // Apply settings immediately upon loading
          setTheme(settingsData.theme);
          setFontFamily(settingsData.fontFamily);
          setFontSize(settingsData.fontSize);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadData();
  }, [user?.uid]);

  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  });

  const successAnimation = useSpring({
    opacity: showSuccess ? 1 : 0,
    transform: showSuccess ? 'translateY(0)' : 'translateY(-20px)',
    config: { tension: 280, friction: 20 },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    setIsSaving(true);

    try {
      await Promise.all([
        profiles.addDocument(user.uid, profile),
        settings.addDocument(user.uid, appSettings)
      ]);

      // Apply settings immediately after saving
      setTheme(appSettings.theme);
      setFontFamily(appSettings.fontFamily);
      setFontSize(appSettings.fontSize);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <animated.div style={fadeIn} className="max-w-4xl mx-auto">
      <div className="bg-surface rounded-4xl shadow-xl p-8">
        <div className="flex items-center space-x-4 mb-8">
          <Settings2 className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold text-text">Profile Settings</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Child Profile Section */}
          <section className="space-y-6">
            <h3 className="text-2xl font-semibold text-text flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-secondary" />
              Child Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-secondary">
                  Child's Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-text-secondary">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  min="1"
                  max="12"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="ethnicity" className="block text-sm font-medium text-text-secondary">
                  Race and Ethnicity (U.S. Census Categories)
                </label>
                <select
                  id="ethnicity"
                  value={profile.ethnicity}
                  onChange={(e) => setProfile({ ...profile, ethnicity: e.target.value as EthnicityCategory })}
                  className="select-field"
                >
                  {ETHNICITY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* App Settings Section */}
          <section className="space-y-6">
            <h3 className="text-2xl font-semibold text-text flex items-center">
              <Type className="w-6 h-6 mr-2 text-secondary" />
              Reading Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="theme" className="block text-sm font-medium text-text-secondary">
                  Theme
                </label>
                <div className="relative">
                  <select
                    id="theme"
                    value={appSettings.theme}
                    onChange={(e) => setAppSettings({ ...appSettings, theme: e.target.value as AppSettings['theme'] })}
                    className="select-field"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                  {appSettings.theme === 'light' ? (
                    <Sun className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
                  ) : (
                    <Moon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="fontFamily" className="block text-sm font-medium text-text-secondary">
                  Font Style
                </label>
                <div className="relative">
                  <select
                    id="fontFamily"
                    value={appSettings.fontFamily}
                    onChange={(e) => setAppSettings({ ...appSettings, fontFamily: e.target.value as AppSettings['fontFamily'] })}
                    className="select-field"
                  >
                    <option value="comic-sans">Comic Sans</option>
                    <option value="opendyslexic">OpenDyslexic</option>
                    <option value="lexend">Lexend</option>
                    <option value="atkinson">Atkinson</option>
                    <option value="andika">Andika</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="fontSize" className="block text-sm font-medium text-text-secondary">
                  Font Size
                </label>
                <div className="relative">
                  <select
                    id="fontSize"
                    value={appSettings.fontSize}
                    onChange={(e) => setAppSettings({ ...appSettings, fontSize: e.target.value as AppSettings['fontSize'] })}
                    className="select-field"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="readingSpeed" className="block text-sm font-medium text-text-secondary">
                  Reading Speed
                </label>
                <div className="relative">
                  <select
                    id="readingSpeed"
                    value={appSettings.readingSpeed}
                    onChange={(e) => setAppSettings({ ...appSettings, readingSpeed: e.target.value as AppSettings['readingSpeed'] })}
                    className="select-field"
                  >
                    <option value="slow">Slow</option>
                    <option value="medium">Medium</option>
                    <option value="fast">Fast</option>
                  </select>
                  <Clock3 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={appSettings.notifications}
                    onChange={(e) => setAppSettings({ ...appSettings, notifications: e.target.checked })}
                    className="w-5 h-5 rounded text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-text-secondary">Enable Notifications</span>
                  <Bell className="w-5 h-5 text-text-secondary" />
                </label>
              </div>
            </div>
          </section>

          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>

        {/* Success Message */}
        {showSuccess && (
          <animated.div
            style={successAnimation}
            className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg"
          >
            Settings saved successfully!
          </animated.div>
        )}
      </div>
    </animated.div>
  );
}