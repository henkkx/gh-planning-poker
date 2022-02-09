import { useBoolean } from "@chakra-ui/react";
import * as React from "react";
import { useIsMobile } from "../../utils/hooks";

export const useMobileMenuState = () => {
  const [isOpen, actions] = useBoolean();
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (isMobile === false) {
      actions.off();
    }
  }, [isMobile, actions]);

  return { isOpen, ...actions };
};
