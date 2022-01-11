import {
  useColorModeValue,
  Flex,
  Box,
  Stack,
  Heading,
  Avatar,
} from "@chakra-ui/react";
import { MobileMenuButton } from "../../components/SidebarMenu/MobileMenuButton";
import { NavSectionTitle } from "../../components/SidebarMenu/NavSectionTitle";
import { ScrollArea } from "../../components/SidebarMenu/ScrollArea";
import { SidebarLink } from "../../components/SidebarMenu/SidebarLink";
import { useMobileMenuState } from "../../components/SidebarMenu/useMobileMenuState";

function PokerGameLayout({ players, repo, title, children }: any) {
  const { isOpen, toggle } = useMobileMenuState();
  const sidebarBg = useColorModeValue("blue.800", "gray.800");
  const contentBg = useColorModeValue("white", "gray.700");

  return (
    <Flex
      height="100vh"
      bg={sidebarBg}
      overflow="hidden"
      sx={{ "--sidebar-width": "16rem" }}
    >
      <Box
        as="nav"
        display="block"
        flex="1"
        width="var(--sidebar-width)"
        left="0"
        py="5"
        px="3"
        color="gray.200"
        position="fixed"
      >
        <Box fontSize="sm" lineHeight="tall">
          <ScrollArea pt="5" pb="6">
            <Stack pb="6">
              <NavSectionTitle>Tasks to estimate</NavSectionTitle>
            </Stack>
            <Stack>
              <NavSectionTitle>Participants</NavSectionTitle>

              {players.map(({ id, name }: any) => (
                <SidebarLink key={id} avatar={<Avatar size="xs" name={name} />}>
                  {name}
                </SidebarLink>
              ))}
            </Stack>
          </ScrollArea>
        </Box>
      </Box>
      <Box
        flex="1"
        p={{ base: "0", md: "6" }}
        marginStart={{ md: "var(--sidebar-width)" }}
        position="relative"
        left={isOpen ? "var(--sidebar-width)" : "0"}
        transition="left 0.2s"
      >
        <Box
          maxW="2560px"
          bg={contentBg}
          height="100%"
          pb="6"
          rounded={{ md: "lg" }}
        >
          <Flex direction="column" height="full">
            <Flex
              w="full"
              py="4"
              justify="space-between"
              align="center"
              px="10"
            >
              <Flex align="center" minH="8">
                <MobileMenuButton onClick={toggle} isOpen={isOpen} />
                <Heading size="md" as="h2" maxH="200" overflowY="auto">
                  {title}
                </Heading>
              </Flex>
            </Flex>
            <Flex direction="column" flex="1" overflow="auto" px={[1, 1, 2, 4]}>
              <Box borderWidth="3px" borderStyle="dashed" py="5" rounded="xl">
                {children}
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
}

export default PokerGameLayout;
