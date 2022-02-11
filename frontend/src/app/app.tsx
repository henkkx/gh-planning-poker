import * as React from "react";
import { useAuth } from "../auth";
import { FullPageProgress } from "../components/Spinner";

const AuthenticatedApp = React.lazy(
  () => import(/* webpackPrefetch: true */ "./authenticated-app")
);
const UnauthenticatedApp = React.lazy(() => import("../screens/login/"));

export function App() {
  const { user, logout } = useAuth();

  return (
    <React.Suspense fallback={<FullPageProgress />}>
      {user?.isAuthenticated ? (
        <AuthenticatedApp logout={logout!} user={user} />
      ) : (
        <UnauthenticatedApp />
      )}
    </React.Suspense>
  );
}
