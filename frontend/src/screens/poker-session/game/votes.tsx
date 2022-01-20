import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  OrderedList,
  ListItem,
} from "@chakra-ui/react";
import { Card } from "../../../components/Card";
import { ScrollArea } from "../../../components/SidebarMenu/ScrollArea";

type Props = {
  votes: Array<string>;
  bgColor: string;
  stats: any;
};

function Votes({ votes, stats, bgColor }: Props) {
  return (
    <Card bg={bgColor} mt="2" maxH="300">
      <ScrollArea h="250">
        {votes.length ? (
          <Table size="sm" mb="5">
            <Thead>
              <Tr>
                <Th isNumeric>Total Votes</Th>
                <Th isNumeric>Unsure votes</Th>
                <Th isNumeric>Mean (h)</Th>
                <Th isNumeric>Median (h)</Th>
                <Th isNumeric>Standard Deviation (h)</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td isNumeric> {stats.total_vote_count} </Td>
                <Td isNumeric> {stats.undecided_count} </Td>
                <Td isNumeric> {stats.mean} </Td>
                <Td isNumeric> {stats.median} </Td>
                <Td isNumeric>{stats.std_dev}</Td>
              </Tr>
            </Tbody>
          </Table>
        ) : (
          "No votes were cast..."
        )}

        <OrderedList>
          {votes.map((description) => (
            <ListItem key={description}> {description} </ListItem>
          ))}
        </OrderedList>
      </ScrollArea>
    </Card>
  );
}

export default Votes;
