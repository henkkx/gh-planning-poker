import * as React from "react";

interface Options {
  initialStep: number;
}

export const useSteps = ({ initialStep }: Options) => {
  const [activeStep, setActiveStep] = React.useState(initialStep);

  const nextStep = () => setActiveStep(activeStep + 1);
  const prevStep = () => setActiveStep(activeStep - 1);
  const reset = () => setActiveStep(0);

  return { nextStep, prevStep, reset, activeStep, setActiveStep };
};
