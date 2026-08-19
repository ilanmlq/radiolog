import { useAuth0, User } from '@auth0/auth0-react';
import { createContext, FC, ReactNode, useEffect, useState } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export interface AuthContextProps {
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  user?: User;
  claims?: UserClaims;
}

interface UserClaims {
  organisationId?: number;
  roles: Role[];
}

export enum Role {
  ADMIN = 'admin',
  VIEWER = 'viewer',
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined,
);

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [claims, setClaims] = useState<UserClaims>();
  const {
    isLoading,
    isAuthenticated,
    user,
    logout: logoutWithRedirect,
    loginWithRedirect: login,
    getIdTokenClaims,
  } = useAuth0();

  useEffect(() => {
    (async () => {
      if (isAuthenticated && !isLoading) {
        const idToken = await getIdTokenClaims();

        const claims: UserClaims = {
          organisationId: idToken?.['radio-log/organisationId'],
          roles: idToken?.['radio-log/roles'],
        };

        setClaims(claims);
      }
    })();
  }, [isAuthenticated, isLoading]);

  const logout = async () => {
    const returnTo = import.meta.env.VITE_AUTH0_LOGOUT_REDIRECT_URL || window.location.origin;
    await logoutWithRedirect({
      logoutParams: {
        returnTo: returnTo,
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        login,
        logout,
        user,
        claims,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
