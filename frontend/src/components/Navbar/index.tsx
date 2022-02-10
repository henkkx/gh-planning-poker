import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Divider,
  Flex,
  HStack,
  IconButton,
  SimpleGrid,
  Spacer,
  Stack,
  TabIndicator,
  TabList,
  Tabs,
  useColorModeValue as mode,
  useDisclosure,
} from "@chakra-ui/react";
import React, { isValidElement, ReactElement } from "react";
import { MobileNavContent } from "./MobileNavContent";

export const Template: React.FC = (props) => {
  const children = React.Children.toArray(props.children).filter<ReactElement>(
    isValidElement
  );
  const mobileNav = useDisclosure();

  const links = children.find((child) => child.type === Links)?.props.children;

  return (
    <Flex
      py="2vh"
      px={{ base: 4, md: 6, lg: 8 }}
      bg={mode("white", "gray.800")}
      boxShadow="none"
      borderBottomWidth={mode("0", "1px")}
    >
      {children.find((child) => child.type === Brand)?.props.children}
      <HStack display={{ base: "none", md: "flex" }} marginStart={4}>
        <Tabs colorScheme="blue" variant="unstyled" isFitted>
          <TabList>{links}</TabList>
          <TabIndicator
            mt="13px"
            height={1}
            borderTopRadius="md"
            bg={mode("blue.500", "blue.200")}
          />
        </Tabs>
      </HStack>
      <Spacer />
      <HStack display={{ base: "none", md: "flex" }} spacing={3}>
        {children.find((child) => child.type === UserProfile)?.props.children}
      </HStack>

      <IconButton
        display={{ base: "flex", md: "none" }}
        size="sm"
        aria-label="Open menu"
        fontSize="20px"
        variant="ghost"
        onClick={mobileNav.onOpen}
        icon={<HamburgerIcon />}
      />

      <MobileNavContent isOpen={mobileNav.isOpen} onClose={mobileNav.onClose}>
        <Stack spacing={5}>
          <Flex>
            {children.find((child) => child.type === Brand)?.props.children}
          </Flex>
          <Tabs orientation="vertical" variant="unstyled">
            <TabList>
              {React.Children.map(links, (child) =>
                React.cloneElement(child, {
                  onClick: mobileNav.onClose,
                  my: 6,
                  size: "xl",
                })
              )}
            </TabList>
            <TabIndicator
              marginStart="-3"
              width={1}
              borderTopRadius={{ base: "none", md: "md" }}
              bg={mode("blue.500", "blue.200")}
            />
          </Tabs>
          <Divider />

          <SimpleGrid columns={2} spacing={8}>
            {
              children.find((child) => child.type === UserProfile)?.props
                .children
            }
          </SimpleGrid>
        </Stack>
      </MobileNavContent>
    </Flex>
  );
};

const Brand: React.FC = () => null;
const Links: React.FC = () => null;
const UserProfile: React.FC = () => null;

export const Navbar = Object.assign(Template, { Brand, Links, UserProfile });
