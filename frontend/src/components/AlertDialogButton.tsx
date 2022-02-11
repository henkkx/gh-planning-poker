import * as React from "react";
import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  ButtonProps,
} from "@chakra-ui/react";

type Props = {
  header: string;
  body: string;
  onClick: () => void;
} & ButtonProps;

function AlertDialogButton({ header, body, onClick, ...buttonProps }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  const handleClick = () => {
    handleClose();
    onClick();
  };

  return (
    <>
      <Button
        colorScheme="red"
        onClick={() => setIsOpen(true)}
        {...buttonProps}
      >
        {header}
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef.current}
        onClose={handleClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {header}
            </AlertDialogHeader>

            <AlertDialogBody>{body}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef.current} onClick={handleClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleClick} ml={3}>
                {header}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export { AlertDialogButton };
