import React from "react";
import { Box, Typography } from "@mui/material";

export const DialogContentSection = ({ children, headingText, top }) => (
  <Box mt={top ? 0 : 5} mb={1}>
    <Typography variant="h6" mb={1}>
      {headingText}
    </Typography>
    <Box pl={2}>{children}</Box>
  </Box>
);
