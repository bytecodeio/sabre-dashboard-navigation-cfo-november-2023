import React from "react";
import { Box } from "@mui/material";

export const EmbedContainer = React.forwardRef((props, ref) => (
  <Box
    sx={{
      height: "100%",
      width: "100%",
      "> iframe": {
        height: "100%",
        width: "100%",
      },
    }}
    ref={ref}
  />
));
