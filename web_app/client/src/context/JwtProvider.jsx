import { createContext, useContext, useState, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';

const JwtContext = createContext(null);

export const JwtProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('jwt'));

  const decodedJwt = useMemo(() => {
    if (!token || token === 'undefined' || token === 'null') return null;
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      localStorage.removeItem('jwt');
      return null;
    }
  }, [token]);

  const updateToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('jwt', newToken);
    } else {
      localStorage.removeItem('jwt');
    }
    setToken(newToken);
  };

  return <JwtContext.Provider value={{ decodedJwt, rawToken: token, updateToken }}>{children}</JwtContext.Provider>;
};

export const useJwt = () => {
  const context = useContext(JwtContext);

  if (!context) throw new Error('useJwt must be used within a JwtProvider');

  return context;
};
