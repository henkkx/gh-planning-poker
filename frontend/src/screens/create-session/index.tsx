import {
  Box,
  Button,
  chakra,
  Divider,
  Heading,
  Stack,
  useBoolean,
  useColorModeValue,
  Img,
} from "@chakra-ui/react";
import * as React from "react";
import { Card } from "../../components/Card";
import { OrgRepoSwitch } from "../../components/Form/OrgRepoSwitch";
import { OrgTextField } from "../../components/Form/OrgTextField";
import { RepoTextField } from "../../components/Form/RepoTextField";
import CreateSessionImg from "./new_game.svg";
import * as api from "../../api";

interface FormElements extends HTMLFormControlsCollection {
  orgInput?: HTMLInputElement;
  repoInput: HTMLInputElement;
}
interface GithubFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export const CreateSessionView = () => {
  const [isOrgRepoSelected, orgRepo] = useBoolean(false);

  async function handleSubmit(e: React.FormEvent<GithubFormElement>) {
    e.preventDefault();
    const { repoInput, orgInput } = e.currentTarget.elements;

    const repoData = { repo_name: repoInput.value, org_name: orgInput?.value };
    const csrfToken = await api.getCSRF();
    try {
      await api.createPokerSession(repoData, csrfToken);
    } catch (err) {
      console.log(err);
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
