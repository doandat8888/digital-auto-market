import React, { ReactNode, createContext, useContext, useState } from 'react';

type SearchState = {
    searchValue: string;
    setSearchValue: Dispatch<SetStateAction<string>>;
  };
  
  const SearchContext = createContext<SearchState | undefined>(undefined);
  
  export const useSearchContext = () => {
    const context = useContext(SearchContext);
    if (!context) {
      throw new Error('useSearchContext must be used within a SearchProvider');
    }
    return context;
  };
  
  type SearchProviderProps = {
    children: ReactNode;
  };
  
  export const SearchProvider = ({ children }: SearchProviderProps) => {
    const [searchValue, setSearchValue] = useState('');
  
    const searchState: SearchState = {
      searchValue,
      setSearchValue,
    };
  
    return (
      <SearchContext.Provider value={searchState}>
        {children}
      </SearchContext.Provider>
    );
  };