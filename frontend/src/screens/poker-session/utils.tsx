import { useToast, UseToastOptions } from "@chakra-ui/react";

function useSuccessToast() {
  const toast = useToast();

  return (options: UseToastOptions) =>
    toast({
      title: "Vote cast succesfully",
      isClosable: true,
      duration: 3000,
      status: "success",
      position: "bottom",
      ...options,
    });
}

export { useSuccessToast };
