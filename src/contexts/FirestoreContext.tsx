import React, { createContext, useContext } from 'react';
import { useFirestore } from '../hooks/useFirestore';

interface FirestoreContextType {
  stories: ReturnType<typeof useFirestore>;
  profiles: ReturnType<typeof useFirestore>;
  settings: ReturnType<typeof useFirestore>;
}

const FirestoreContext = createContext<FirestoreContextType | undefined>(undefined);

export function FirestoreProvider({ children }: { children: React.ReactNode }) {
  const stories = useFirestore('stories');
  const profiles = useFirestore('profiles');
  const settings = useFirestore('settings');

  return (
    <FirestoreContext.Provider value={{ stories, profiles, settings }}>
      {children}
    </FirestoreContext.Provider>
  );
}

export function useFirestoreContext() {
  const context = useContext(FirestoreContext);
  if (context === undefined) {
    throw new Error('useFirestoreContext must be used within a FirestoreProvider');
  }
  return context;
}