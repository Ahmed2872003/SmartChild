import { useState, createContext, useContext } from 'react';

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [activeChild, setActiveChild] = useState(null);

  const [testDifficulties, setTestDifficulties] = useState({
    memory: 'easy',
    reaction: 'easy',
    color: 'easy',
    hearing: 'easy',
    drawing: 'easy',
  });

  return (
    <AppContext.Provider
      value={{
        activeChild,
        setActiveChild,
        testDifficulties,
        setTestDifficulties,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export { AppContextProvider, useAppContext };
