
import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateSessionId } from '@/utils/dialogflow';

interface DialogflowContextType {
  sessionId: string;
  isInitialized: boolean;
}

const DialogflowContext = createContext<DialogflowContextType | undefined>(undefined);

export const DialogflowProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [sessionId, setSessionId] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    // Generate a session ID when the component mounts
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    
    // In the future, you would initialize the Dialogflow client here
    setIsInitialized(true);
    
    console.log('Dialogflow session initialized:', newSessionId);
    
    // Clean up function
    return () => {
      console.log('Dialogflow session cleanup');
      // Add any cleanup logic here
    };
  }, []);

  return (
    <DialogflowContext.Provider value={{ sessionId, isInitialized }}>
      {children}
    </DialogflowContext.Provider>
  );
};

export const useDialogflow = (): DialogflowContextType => {
  const context = useContext(DialogflowContext);
  if (!context) {
    throw new Error('useDialogflow must be used within a DialogflowProvider');
  }
  return context;
};
