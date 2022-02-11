import * as React from "react";
import * as api from "../api";
import { FullPageProgress } from "../components/Spinner";
import { useAsync } from "../utils/hooks";

export type User = {
  name: string;
  email: string;
  isAuthenticated: boolean;
  avatarUrl?: string;
};

type AuthContextValue = {
  user?: User;
  logout?: () => void;
};

type AuthContextProps = AuthContextValue & {
  children: React.ReactNode;
};

const AuthContext = React.createContext<Partial<AuthContextProps>>({});
AuthContext.displayName = "AuthContext";

function AuthProvider(props: AuthContextProps) {
  const {
    data: user,
    status,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync<User | undefined>();

  React.useEffect(() => {
    const userInfoPromise = api.getUserInfo();
    run(userInfoPromise);
  }, [run]);

  const logout = React.useCallback(() => {
    api.logout();
    setData(undefined);
  }, []);

  const value: AuthContextValue = React.useMemo(
    () => ({ user, logout }),
    [logout, user]
  );

  if (isLoading || isIdle) {
    return <FullPageProgress />;
  }

  if (isError) {
    return <p> {error.statusText}</p>;
  }

  if (isSuccess) {
    return <AuthContext.Provider value={value} {...props} />;
  }

  throw new Error(`Unhandled status: ${status}`);
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}

export { AuthProvider, useAuth };
