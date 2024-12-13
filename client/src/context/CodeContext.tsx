import { languageDetails } from '@/lib/Action';
import { createContext, useContext, useState, ReactNode } from 'react';

interface CodeContextType {
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  defaultCode: string;
}

const CodeContext = createContext<CodeContextType | undefined>(undefined);

export const useCodeContext = () => {
  const context = useContext(CodeContext);
  if (!context) {
    throw new Error('useCodeContext must be used within a CodeProvider');
  }
  return context;
};

interface CodeProviderProps {
  children: ReactNode;
}

export const CodeProvider = ({ children }: CodeProviderProps) => {
  const [language, setLanguage] = useState<string>('JavaScript');
  const [code, setCode] = useState<string>(languageDetails['JavaScript'].defaultCode);

  const setLanguageAndCode = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(languageDetails[newLanguage as keyof typeof languageDetails]?.defaultCode || languageDetails['JavaScript'].defaultCode);
  };

  return (
    <CodeContext.Provider value={{
      code,
      setCode,
      language,
      setLanguage: setLanguageAndCode,
      defaultCode: languageDetails[language as keyof typeof languageDetails].defaultCode
    }}>
      {children}
    </CodeContext.Provider>
  );
};