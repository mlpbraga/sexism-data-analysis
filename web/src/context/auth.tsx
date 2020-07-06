import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: string;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

interface AuthState {
  token: string;
  user: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@SexismResearch:token');
    const user = localStorage.getItem('@SexismResearch:user');

    if (token && user) {
      return {
        token,
        user,
      };
    }
    return {} as AuthState;
  });
  const signIn = useCallback(async ({ email, password }): Promise<void> => {
    const response = await api.post('auth', {
      email,
      password,
    });
    const { token, user } = response.data;

    localStorage.setItem('@SexismResearch:token', token);
    localStorage.setItem('@SexismResearch:user', token);
    api.defaults.headers.authorization = `Bearer ${token}`;
    setData({ token, user });
  }, []);

  const signOut = useCallback((): void => {
    localStorage.removeItem('@SexismResearch:token');
    localStorage.removeItem('@SexismResearch:user');
    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
