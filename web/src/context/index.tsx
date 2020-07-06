import React from 'react';
import { AuthProvider } from './auth';
import { ToastProvider } from './toast';

const AppProvider: React.FC = ({ children }) => (
  <ToastProvider>
    <AuthProvider>{children}</AuthProvider>
  </ToastProvider>
);

export default AppProvider;
