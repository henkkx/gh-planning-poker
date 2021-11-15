import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "../auth/auth-provider";
import theme from "./theme";
import { ChakraProvider } from "@chakra-ui/react";

const queryConfig = {
  defaultOptions: {
    queries: {
      useErrorBoundary: true,
      refetchOnWindowFocus: false,
      retry(failureCount: number, error: any) {
        if (error.status === 404) {
          return false;
        } else if (failureCount < 2) {
          return true;
        } else {
          return false;
        }
      },
    },
  },
};

const queryClient = new QueryClient(queryConfig);

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <AuthProvider>{children}</AuthProvider>
        </BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export { AppProviders };
