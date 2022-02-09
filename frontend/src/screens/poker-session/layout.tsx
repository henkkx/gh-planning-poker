import * as React from "react";
import {
  useColorModeValue,
  Flex,
  Box,
  Stack,
  Text,
  Avatar,
  Tooltip,
  Button,
  useToast,
} from "@chakra-ui/react";
import { HiClipboardCopy } from "react-icons/hi";
import { MobileMenuButton } from "../../components/SidebarMenu/MobileMenuButton";
import { NavSectionTitle } from "../../components/SidebarMenu/NavSectionTitle";
import { ScrollArea } from "../../components/SidebarMenu/ScrollArea";
import { SidebarLink } from "../../components/SidebarMenu/SidebarLink";
import { useMobileMenuState } from "../../components/SidebarMenu/useMobileMenuState";
import { Steps, Step } from "../../components/Steps";
import { useIsMobile } from "../../utils/hooks";
import { copyLinkToGameToClipboard } from "../../utils/misc";
import { Player } from "./game/machine";

type Props = {
  players: Array<Player>;
  title?: string;
  tasks: Array<string>;
  children: React.ReactNode;
  activeTaskIdx: number;
  sessionIsInactive: boolean;
};

function PokerGameLayout({
  players,
  title,
  children,
  tasks,
  activeTaskIdx,
  sessionIsInactive,
}: Props) {
  const { isOpen, toggle } = useMobileMenuState();
  const isMobile = useIsMobile();
  const toast = useToast();
  const sidebarBg = useColorModeValue("blue.800", "gray.800");
  const contentBg = useColorModeValue("white", "gray.700");

  const handleCopyLink = () => {
    copyLinkToGameToClipboard();
    toast({
      title: "Link copied!",
      duration: 1000,
    });
  };

  return (
    <Flex height="92vh" bg={sidebarBg} sx={{ "--sidebar-width": "16rem" }}>
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
          {!sessionIsInactive ? (
            <ScrollArea pt="5" pb="6">
              <Stack pb="2">
                <NavSectionTitle>Invite Players</NavSectionTitle>
                <Box
                  mx="auto"
                  maxW="lg"
                  py="4"
                  px={{ base: "2", md: "2" }}
                  minH="50px"
                >
                  <Button
                    aria-label="Copy Invite Link"
                    colorScheme="blue"
                    leftIcon={<HiClipboardCopy />}
                    onClick={handleCopyLink}
                    size="sm"
                  >
                    Copy link to the game
                  </Button>
                </Box>
              </Stack>
              <Stack pb="6">
                <NavSectionTitle>Participants</NavSectionTitle>

                {players.map(({ id, name }: any) => (
                  <SidebarLink
                    key={id}
                    avatar={<Avatar size="xs" name={name} />}
                  >
                    {name}
                  </SidebarLink>
                ))}
              </Stack>
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
                        onClick={() => toast({ title, isClosable: true })}
                        title={
                          title.length < 20
                            ? title
                            : title.substring(0, 20) + "..."
                        }
                        tooltip={Tooltip}
                        tooltipProps={{
                          placement: "start",
                          label: title,
                        }}
                      />
                    ))}
                  </Steps>
                </Box>
              </Stack>
            </ScrollArea>
          ) : null}
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
        <Box
          maxW="2560px"
          bg={contentBg}
          h="100%"
          py="2"
          rounded={{ md: "lg" }}
        >
          <Flex direction="column" height="full" minH="100%">
            <Flex direction="column" flex="1" px={[1, 1, 2, 4]} minH="100%">
              {isMobile ? (
                <MobileMenuButton mb="2" onClick={toggle} isOpen={isOpen}>
                  Open Task Information
                </MobileMenuButton>
              ) : null}
              <Flex
                justifyContent={"center"}
                borderWidth="3px"
                borderStyle="dashed"
                rounded="xl"
                minH="100%"
                py="2"
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
