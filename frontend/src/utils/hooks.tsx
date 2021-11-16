import * as React from "react";
import { useLocation } from "react-router-dom";

// custom hook to get the current pathname in React

const usePathname = () => {
  const location = useLocation();
  return location.pathname;
};

function useSafeDispatch(dispatch: React.Dispatch<any>) {
  const isMounted = React.useRef(false);
  React.useLayoutEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return React.useCallback(
    (action) => (isMounted.current ? dispatch(action) : void 0),
    [dispatch]
  );
}

// Example usage:
// const {data, error, status, run} = useAsync()
// React.useEffect(() => {
//   run(fetchSomething(path))
// }, [path, run])
// thanks to Kent C. Dodds for his tutorial on creating the useAsync hook
// I have modified it slightly to fit my needs, mainly using typescript
const defaultInitialState = { status: "idle", data: null, error: null };

type State<DataType> = {
  status: "idle" | "resolved" | "rejected" | "pending";
  data?: DataType;
  error?: any;
};

function useAsync<DataType>(initialState?: State<DataType>) {
  const initialStateRef = React.useRef({
    ...defaultInitialState,
    ...initialState,
  });

  const reducer = (s: any, a: any) => ({ ...s, ...a });
  const [state, setState] = React.useReducer(reducer, initialStateRef.current);

  const { status, data, error } = state as State<DataType>;

  const safeSetState = useSafeDispatch(setState);

  const setData = React.useCallback(
    (data: DataType) => safeSetState({ data, status: "resolved" }),
    [safeSetState]
  );
  const setError = React.useCallback(
    (error) => safeSetState({ error, status: "rejected" }),
    [safeSetState]
  );
  const reset = React.useCallback(
    () => safeSetState(initialStateRef.current),
    [safeSetState]
  );

  const run = React.useCallback(
    (promise: Promise<DataType>) => {
      safeSetState({ status: "pending" });
      return promise.then(
        (data: DataType) => {
          setData(data);
          return data;
        },
        (error) => {
          setError(error);
          // throw error;
        }
      );
    },
    [safeSetState, setData, setError]
  );

  return {
    isIdle: status === "idle",
    isLoading: status === "pending",
    isError: status === "rejected",
    isSuccess: status === "resolved",

    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  };
}

export { useAsync, usePathname };
