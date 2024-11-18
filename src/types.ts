export interface Story {
  id: number;
  title: string;
  coverImage: string;
  pages: StoryPage[];
}

export interface StoryPage {
  text: string;
  image: string;
}

export interface ChildProfile {
  name: string;
  age: number;
  ethnicity: EthnicityCategory;
}

export type EthnicityCategory =
  | 'hispanic-latino'
  | 'white'
  | 'black-african-american'
  | 'american-indian-alaska-native'
  | 'asian'
  | 'native-hawaiian-pacific-islander'
  | 'two-or-more-races'
  | 'prefer-not-to-say';

export interface AppSettings {
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: 'comic-sans' | 'opendyslexic' | 'lexend' | 'atkinson' | 'andika';
  notifications: boolean;
  readingSpeed: 'slow' | 'medium' | 'fast';
}

export interface ThemeContext {
  theme: AppSettings['theme'];
  fontFamily: AppSettings['fontFamily'];
  fontSize: AppSettings['fontSize'];
  setTheme: (theme: AppSettings['theme']) => void;
  setFontFamily: (font: AppSettings['fontFamily']) => void;
  setFontSize: (size: AppSettings['fontSize']) => void;
}