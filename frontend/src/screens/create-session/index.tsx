import {
  Box,
  Button,
  chakra,
  Divider,
  Heading,
  Stack,
  Img,
  useToast,
  useBoolean,
} from "@chakra-ui/react";
import * as React from "react";
import { Card } from "../../components/Card";
import { OrgRepoSwitch } from "../../components/Form/OrgRepoSwitch";
import { OrgTextField } from "../../components/Form/OrgTextField";
import { RepoTextField } from "../../components/Form/RepoTextField";
import CreateSessionImg from "./new_game.svg";
import * as api from "../../api";
import { useHistory } from "react-router-dom";
import { LabelsTextField } from "../../components/Form/LabelsTextField";
import { FullPageProgress } from "../../components/Spinner";

interface FormElements extends HTMLFormControlsCollection {
  repoInput: HTMLInputElement;
  orgInput?: HTMLInputElement;
  labelsInput?: HTMLInputElement;
}
interface GithubFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

interface FormValues {
  repo_name: string;
  org_name?: string;
  labels?: string;
}

export const CreateSessionView = () => {
  const [isOrgRepoSelected, orgRepo] = useBoolean(false);
  const toast = useToast();
  const history = useHistory();
  const [isLoading, setIsLoading] = React.useState(false);

  function handleSubmit(e: React.FormEvent<GithubFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const { repoInput, orgInput, labelsInput } = e.currentTarget.elements;

    const repo_name = repoInput.value;
    const org_name = orgInput?.value;
    const labels = labelsInput?.value;
    createSession({ repo_name, org_name, labels });
  }

  async function createSession({ repo_name, org_name, labels }: FormValues) {
    try {
      const csrfToken = await api.getCSRF();
      const { id } = await api.createPokerSession(
        { repo_name, org_name, labels },
        csrfToken
      );
      history.push(`/play/${id}`);
    } catch (err: any) {
      let title, description;

      if (err.toString() === "Error: Not Found") {
        title = `No issues matching all the following labels: [${labels}]`;
        description = "Remember to enter the labels separated by a comma";
      } else {
        title = `Unable to create session - ${err}`;
        description = `No repository with the name "${repo_name}" was found in your ${
          org_name ? "organization's" : ""
        } Github Account`;
      }
      setIsLoading(false);
      toast({
        title,
        description,
        status: "error",
        isClosable: true,
      });
    }
  }

  if (isLoading) {
    return <FullPageProgress text="Creating Planning Poker Session..." />;
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
                <LabelsTextField />
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
