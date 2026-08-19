import { AuthContext, AuthContextProps } from './auth.provider';
import { useContext } from 'react';

export const useAuth = (): AuthContextProps => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return authContext;
};
