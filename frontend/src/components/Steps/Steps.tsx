import * as React from "react";
import StepConnector from "./StepConnector";
import StepsContext from "./StepsContext";

interface Props {
  activeStep: number;
  children?: React.ReactNode;
}

function Steps({ activeStep, children }: Props) {
  const steps = React.useMemo(
    () =>
      React.Children.toArray(children).map((step, i, arr) => (
        <StepsContext.Provider
          key={i}
          value={{
            isActive: activeStep === i,
            isCompleted: activeStep > i,
            isLastStep: arr.length !== i + 1,
            step: i + 1,
          }}
        >
          {step}
          {arr.length !== i + 1 && <StepConnector />}
        </StepsContext.Provider>
      )),
    [activeStep, children]
  );
  return <>{steps}</>;
}

export default Steps;
