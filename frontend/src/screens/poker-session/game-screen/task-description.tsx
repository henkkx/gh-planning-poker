import { Heading } from "@chakra-ui/react";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card } from "../../../components/Card";
import { ScrollArea } from "../../../components/SidebarMenu/ScrollArea";
import { chakraMarkdownComponents } from "./utils";

type Props = {
  title?: string;
  description?: string;
  bgColor: string;
};

function TaskDescription({ title, description, bgColor }: Props) {
  const taskDescriptionMarkdown = description ?? "no description provided.";

  return (
    <Card bg={bgColor} maxH="400" mb="2">
      <ScrollArea maxH="350">
        <Heading as="h3" mb="4" size="lg">
          {title}
        </Heading>
        <ReactMarkdown
          children={taskDescriptionMarkdown}
          remarkPlugins={[remarkGfm]}
          components={chakraMarkdownComponents}
          skipHtml
        ></ReactMarkdown>
      </ScrollArea>
    </Card>
  );
}

export default TaskDescription;
