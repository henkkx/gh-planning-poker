import * as React from "react";
import StepsContext from "./StepsContext";

function useStep() {
  const context = React.useContext(StepsContext);
  if (!context) {
    throw Error("Wrap your step with `<Steps />`");
  } else {
    return context;
  }
}

export default useStep;
