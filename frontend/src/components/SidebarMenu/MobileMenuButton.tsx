import { Text, Button, ButtonProps } from "@chakra-ui/react";
import { HiMenuAlt1, HiX } from "react-icons/hi";

interface MobileMenuButtonProps extends ButtonProps {
  isOpen: boolean;
}

export const MobileMenuButton = (props: MobileMenuButtonProps) => {
  const { onClick, isOpen, ...rest } = props;
  return (
    <Button
      w={isOpen ? "25%" : "50%"}
      display={{ base: "flex", md: "none" }}
      rounded="md"
      p="1"
      ml={isOpen ? "-100px" : "10px"}
      fontSize="md"
      colorScheme="blue"
      onClick={onClick}
      textAlign="left"
      leftIcon={isOpen ? <HiX /> : <HiMenuAlt1 />}
      alignItems="center"
      {...rest}
    >
      {isOpen ? "Close" : "Open Session Info"}
    </Button>
  );
};
