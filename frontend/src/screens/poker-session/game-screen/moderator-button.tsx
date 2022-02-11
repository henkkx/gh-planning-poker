import { Button } from "@chakra-ui/react";

type Props = {
  onClick: () => void;
};

const ModeratorButton: React.FC<Props> = ({ onClick, children }) => (
  <Button w="80%" justifySelf="center" colorScheme="blue" onClick={onClick}>
    {children}
  </Button>
);

export default ModeratorButton;
