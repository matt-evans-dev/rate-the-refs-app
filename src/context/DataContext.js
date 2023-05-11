import React, { createContext, useState } from 'react';

export const DataContext = createContext({
  forceRefresh: null,
  setForceRefresh: () => {}
});

export const DataContextProvider = ({ children }) => {
  const setForceRefresh = gameId => {
    setState(prev => {
      return {
        ...prev,
        forceRefresh: gameId
      };
    });
  };

  const [state, setState] = useState({ forceRefresh: null, setForceRefresh });

  return <DataContext.Provider value={state}>{children}</DataContext.Provider>;
};

export const DataContextConsumer = DataContext.Consumer;
