import React from 'react';
import { DataContextProvider } from './DataContext';

const ContextProvider = ({ children }) => {
  return <DataContextProvider>{children}</DataContextProvider>;
};

export default ContextProvider;
