import { BellIcon } from "@chakra-ui/icons";
import { Flex, IconButton, HStack, Avatar, Text } from "@chakra-ui/react";
import * as React from "react";

interface Props {
  name: string;
  email: string;
  avatarUrl: string;
}

export const UserProfile: React.FC<Props> = (props) => {
  const { name, email, avatarUrl } = props;
  return (
    <HStack spacing={3} order={{ base: 1, md: 2 }} flex="1">
      <Avatar name={name} size="sm" />
      <Flex direction="column" display={{ base: "flex", md: "none" }}>
        <Text fontWeight="bold" lineHeight="shorter">
          {name}
        </Text>
        <Text fontSize="sm" lineHeight="shorter" opacity={0.7}>
          {email}
        </Text>
      </Flex>
    </HStack>
  );
};
