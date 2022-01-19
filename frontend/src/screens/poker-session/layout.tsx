import {
  useColorModeValue,
  Flex,
  Box,
  Stack,
  Heading,
  Avatar,
  Tooltip,
} from "@chakra-ui/react";
import { MobileMenuButton } from "../../components/SidebarMenu/MobileMenuButton";
import { NavSectionTitle } from "../../components/SidebarMenu/NavSectionTitle";
import { ScrollArea } from "../../components/SidebarMenu/ScrollArea";
import { SidebarLink } from "../../components/SidebarMenu/SidebarLink";
import { useMobileMenuState } from "../../components/SidebarMenu/useMobileMenuState";
import { Steps, Step } from "../../components/Steps";
import { Player } from "./machine";

type Props = {
  players: Array<Player>;
  title: string;
  tasks: Array<string>;
  children: React.ReactNode;
  activeTaskIdx: number;
};

function PokerGameLayout({
  players,
  title,
  children,
  tasks,
  activeTaskIdx,
}: Props) {
  const { isOpen, toggle } = useMobileMenuState();
  const sidebarBg = useColorModeValue("blue.800", "gray.800");
  const contentBg = useColorModeValue("white", "gray.700");

  return (
    <Flex
      height="92vh"
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
        py="2"
        px="3"
        color="gray.200"
        position="fixed"
      >
        <Box fontSize="sm" lineHeight="tall">
          <ScrollArea pt="5" pb="6">
            <Stack pb="6">
              <NavSectionTitle>Tasks to estimate</NavSectionTitle>
              <Box
                mx="auto"
                maxW="2xl"
                py="4"
                px={{ base: "6", md: "8" }}
                minH="100px"
              >
                <Steps activeStep={activeTaskIdx}>
                  {tasks.map((title) => (
                    <Step
                      key={title}
                      title={
                        title.length < 20
                          ? title
                          : title.substring(0, 20) + "..."
                      }
                      tooltip={Tooltip}
                      tooltipProps={{ placement: "right-start", label: title }}
                    />
                  ))}
                </Steps>
              </Box>
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
        p={{ base: "0", md: "3" }}
        marginStart={{ md: "var(--sidebar-width)" }}
        position="relative"
        left={isOpen ? "var(--sidebar-width)" : "0"}
        transition="left 0.2s"
      >
        <Box maxW="2560px" bg={contentBg} height="100%" rounded={{ md: "lg" }}>
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
                <Heading size="md" as="h2">
                  {title}
                </Heading>
              </Flex>
            </Flex>
            <Flex direction="column" flex="1" px={[1, 1, 2, 4]} py="2">
              <Flex
                justifyContent={"center"}
                borderWidth="3px"
                borderStyle="dashed"
                rounded="xl"
                minH="100%"
                maxH="100%"
                overflow="auto"
              >
                {children}
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
}

export default PokerGameLayout;
