import { Spinner } from "@chakra-ui/spinner";
import * as React from "react";
import { ReactElement } from "react";
// import { queryCache } from "react-query";
import * as api from "../api";
import { FullPageProgress } from "../components/Spinner";
// import { client } from "utils/api-client";
import { useAsync } from "../utils/hooks";
// import { setQueryDataForBook } from "utils/books";
// import { FullPageSpinner, FullPageErrorFallback } from "components/lib";

type User = {
  name: string;
  email: string;
  isAuthenticated: boolean;
};

type AuthContextProps = {
  user?: User;
  logout?: () => void;
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
  } = useAsync();

  React.useEffect(() => {
    const userInfoPromise = api.getUserInfo();
    run(userInfoPromise);
  }, [run]);

  const logout = React.useCallback(() => {
    // auth.logout();
    // queryCache.clear();
    setData(null);
  }, [setData]);

  const value = React.useMemo(() => ({ user, logout }), [logout, user]);

  if (isLoading || isIdle) {
    return <FullPageProgress />;
  }

  if (isError) {
    return <p> error</p>;
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
