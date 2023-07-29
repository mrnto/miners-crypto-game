import { useContext } from 'react';
import { GlobalContext, GlobalContextProvider } from './GlobalContext';

const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within the useGameContext');
  }
  return context;
};

export { GlobalContextProvider, useGlobalContext };