import { Flex, HStack, Avatar, Text } from "@chakra-ui/react";
import * as React from "react";

interface Props {
  name: string;
  username: string;
  avatarUrl: string;
}

export const UserProfile: React.FC<Props> = ({ name, username, avatarUrl }) => {
  return (
    <HStack spacing={3} order={{ base: 1, md: 2 }} flex="1">
      <Avatar name={name} size="sm" src={avatarUrl} />
      <Flex direction="column" display={{ base: "flex", md: "none" }}>
        <Text fontWeight="bold" lineHeight="shorter">
          {name}
        </Text>
        <Text fontSize="sm" lineHeight="shorter" opacity={0.7}>
          {username}
        </Text>
      </Flex>
    </HStack>
  );
};
