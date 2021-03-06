import { refreshPage } from "../../utils/misc";
import { ErrorCard } from "../error";
import { CODE_SESSION_ENDED } from "../../utils/constants";
import GameFinished from "./finished.svg";

type Props = { closeCode?: number };

export default function PokerErrorScreen({ closeCode }: Props) {
  const sessionFinished = closeCode === CODE_SESSION_ENDED;
  const message = sessionFinished
    ? "This session has finished!"
    : "Could not find session";
  return (
    <ErrorCard
      canTryAgain={!sessionFinished}
      onTryAgain={refreshPage}
      message={message}
      errorText={sessionFinished ? "No more tasks left to estimate" : undefined}
      illustration={sessionFinished ? GameFinished : undefined}
    />
  );
}
