import * as React from "react";

export interface Context {
  step: number;
  isActive: boolean;
  isCompleted: boolean;
  isLastStep: boolean;
}

const StepsContext = React.createContext<Context | null>(null);
export default StepsContext;
