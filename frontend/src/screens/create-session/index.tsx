import * as React from "react";
import { Link, useHistory } from "react-router-dom";
import {
  Box,
  Button,
  chakra,
  Divider,
  Stack,
  Img,
  useToast,
  useBoolean,
  Heading,
  Text,
} from "@chakra-ui/react";

import { Card } from "../../components/Card";
import { OrgRepoSwitch } from "../../components/Form/OrgRepoSwitch";
import { OrgTextField } from "../../components/Form/OrgTextField";
import { RepoTextField } from "../../components/Form/RepoTextField";
import CreateSessionImg from "./new_game.svg";
import * as api from "../../api";
import { LabelsTextField } from "../../components/Form/LabelsTextField";
import { FullPageProgress } from "../../components/Spinner";
import { useIsMobile } from "../../utils/hooks";

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
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = React.useState(false);
  const [recentSession, setRecentSession] =
    React.useState<api.RecentPokerSession>();

  React.useEffect(() => {
    api
      .getMostRecentPokerSession()
      .then(setRecentSession)
      .catch((error) => toast({ title: error.toString() }));
  }, [toast, setRecentSession]);

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
        const hasIssues = !!labels?.length;

        if (hasIssues) {
          title = `No open issues found matching all the following labels: [${labels}]`;
          description = `Make sure that your repository has issues and that the labels are entered correctly, separated by commas`;
        } else {
          title = "No issues found in your repository";
          description = "Create some issues in your repository first";
        }
      } else {
        title = `Unable to create session - ${err}`;
        description = `No repository with the name "${repo_name}" was found in your ${
          org_name ? "organization's" : ""
        } Github Account`;
      }
      setIsLoading(false);
      orgRepo.off();
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
    <Box maxW="5xl" my={4} mx="auto" px={{ sm: "8" }}>
      {recentSession ? (
        <Button
          as={Link}
          to={`/play/${recentSession.id}`}
          colorScheme="green"
          size={isMobile ? "sm" : "md"}
          mb="6"
          mx="2"
        >
          {`Join Back to "${recentSession.repoName}"`}
        </Button>
      ) : null}
      <Card>
        <Stack direction={["column", "row"]} spacing="24px">
          <Box>
            <Heading size="md" mb="4">
              Create a new planning poker session
            </Heading>
            <Text fontSize="12" mb="2">
              *Please note if you have lots of open issues (50+) and do not
              search by labels, it may take ~10s to retrieve them from github.
              Moreover, one session can only have max 30 issues. It is thus
              reccomended to search them by labels
            </Text>
            <Divider mb="6" />
            <chakra.form onSubmit={handleSubmit} maxW="sm">
              <Stack spacing="4">
                <OrgRepoSwitch onChange={orgRepo.toggle} />
                <Divider />
                {isOrgRepoSelected ? (
                  <>
                    <OrgTextField isDisabled={!isOrgRepoSelected} />
                    <Divider />
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
