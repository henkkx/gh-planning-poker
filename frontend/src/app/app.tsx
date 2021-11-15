import * as React from "react";
import { useAuth } from "../auth";
import { FullPageProgress } from "../components/Spinner";

const AuthenticatedApp = React.lazy(
  () => import(/* webpackPrefetch: true */ "./authenticated-app")
);
const UnauthenticatedApp = React.lazy(() => import("../screens/home/"));

export const App = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <React.Suspense fallback={<FullPageProgress />}>
      {isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </React.Suspense>
  );
};
