import { renderHook, act } from "@testing-library/react-hooks";
import { useAsync } from "../hooks";

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  console.error = jest.fn();
});

function deferred(): any {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const defaultState = {
  status: "idle",
  data: null,
  error: null,

  isIdle: true,
  isLoading: false,
  isError: false,
  isSuccess: false,

  run: expect.any(Function),
  reset: expect.any(Function),
  setData: expect.any(Function),
  setError: expect.any(Function),
};

const pendingState = {
  ...defaultState,
  status: "pending",
  isIdle: false,
  isLoading: true,
};

const resolvedState = {
  ...defaultState,
  status: "resolved",
  isIdle: false,
  isSuccess: true,
};

const rejectedState = {
  ...defaultState,
  status: "rejected",
  isIdle: false,
  isError: true,
};

test("calling run with a promise which resolves", async () => {
  const { promise, resolve } = deferred();
  const { result } = renderHook(() => useAsync());
  expect(result.current).toEqual(defaultState);
  let p: Promise<any>;
  act(() => {
    p = result.current.run(promise);
  });
  expect(result.current).toEqual(pendingState);
  const resolvedValue = Symbol("resolved value");
  await act(async () => {
    resolve(resolvedValue);
    await p;
  });
  expect(result.current).toEqual({
    ...resolvedState,
    data: resolvedValue,
  });

  act(() => {
    result.current.reset();
  });
  expect(result.current).toEqual(defaultState);
});

test("calling run with a promise which rejects", async () => {
  const { promise, reject } = deferred();
  const { result } = renderHook(() => useAsync());
  expect(result.current).toEqual(defaultState);
  let p;
  act(() => {
    p = result.current.run(promise);
  });
  expect(result.current).toEqual(pendingState);
  const rejectedValue = Symbol("rejected value");
  await act(async () => {
    reject(rejectedValue);
    await p.catch(() => {
      /* ignore erorr */
    });
  });
  expect(result.current).toEqual({ ...rejectedState, error: rejectedValue });
});

test("can specify an initial state", () => {
  const mockData = Symbol("resolved value");
  const customInitialState = {
    status: "resolved",
    data: mockData,
  };
  const { result } = renderHook(() =>
    useAsync<typeof mockData>(customInitialState as any)
  );
  expect(result.current).toEqual({
    ...resolvedState,
    ...customInitialState,
  });
});

test("can set the data", () => {
  const mockData = Symbol("resolved value");
  const { result } = renderHook(() => useAsync());
  act(() => {
    result.current.setData(mockData);
  });
  expect(result.current).toEqual({
    ...resolvedState,
    data: mockData,
  });
});

test("can set the error", () => {
  const mockError = Symbol("rejected value");
  const { result } = renderHook(() => useAsync());
  act(() => {
    result.current.setError(mockError);
  });
  expect(result.current).toEqual({
    ...rejectedState,
    error: mockError,
  });
});

test("No state updates happen if the component is unmounted while pending", async () => {
  const { promise, resolve } = deferred();
  const { result, unmount } = renderHook(() => useAsync());
  let p: Promise<any>;
  act(() => {
    p = result.current.run(promise);
  });
  unmount();
  await act(async () => {
    resolve();
    await p;
  });
  expect(console.error).not.toHaveBeenCalled();
});
