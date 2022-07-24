import React from 'react';

export const initialValue = {
  toggleColorMode: () => {
    //
  }
};

export const Context = React.createContext(initialValue);
export const useContext = React.useContext;
