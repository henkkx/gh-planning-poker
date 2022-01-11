import {
  Box,
  Button,
  chakra,
  Divider,
  Heading,
  Stack,
  useBoolean,
  Img,
  useToast,
} from "@chakra-ui/react";
import * as React from "react";
import { Card } from "../../components/Card";
import { OrgRepoSwitch } from "../../components/Form/OrgRepoSwitch";
import { OrgTextField } from "../../components/Form/OrgTextField";
import { RepoTextField } from "../../components/Form/RepoTextField";
import CreateSessionImg from "./new_game.svg";
import * as api from "../../api";
import { useHistory } from "react-router-dom";

interface FormElements extends HTMLFormControlsCollection {
  orgInput?: HTMLInputElement;
  repoInput: HTMLInputElement;
}
interface GithubFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export const CreateSessionView = () => {
  const [isOrgRepoSelected, orgRepo] = useBoolean(false);
  const toast = useToast();
  const history = useHistory();

  async function handleSubmit(e: React.FormEvent<GithubFormElement>) {
    e.preventDefault();
    const { repoInput, orgInput } = e.currentTarget.elements;

    const csrfToken = await api.getCSRF();

    const repo_name = repoInput.value;
    const org_name = orgInput?.value;
    try {
      const { id } = await api.createPokerSession(
        { repo_name, org_name },
        csrfToken
      );
      history.push(`/play/${id}`);
    } catch (err: any) {
      toast({
        title: `Unable to create session - ${err}`,
        description: `No repository with the name "${repo_name}" was found in your ${
          org_name ? "organization's" : ""
        } Github Account`,
        status: "error",
        isClosable: true,
      });
    }
  }

  return (
    <Box maxW="5xl" mt={12} mx="auto" px={{ sm: "8" }}>
      <Card>
        <Stack direction={["column", "row"]} spacing="24px">
          <Box>
            <Heading size="md" mb="4">
              Create a new planning poker session
            </Heading>
            <Divider mb="6" />
            <chakra.form onSubmit={handleSubmit} maxW="sm">
              <Stack spacing="4">
                <OrgRepoSwitch onChange={orgRepo.toggle} />
                <Divider />
                {isOrgRepoSelected ? (
                  <>
                    <OrgTextField isDisabled={!isOrgRepoSelected} />
                    <Divider />{" "}
                  </>
                ) : null}
                <RepoTextField />
              </Stack>
              <Button type="submit" colorScheme="blue" mt="8">
                Create a session
              </Button>
            </chakra.form>
          </Box>
          <Img maxW="lg" src={CreateSessionImg} />
        </Stack>
      </Card>
    </Box>
  );
};
