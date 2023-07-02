import React from 'react';

export const wordContext = React.createContext({
  words: {},
  setWords: (words: any) => {},
});
