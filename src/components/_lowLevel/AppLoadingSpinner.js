import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export const AppLoadingSpinner = ({ message }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      marginTop="100px"
      alignItems="center"
    >
      <CircularProgress />
      <Typography sx={{ marginTop: "10px" }}>{message}</Typography>
    </Box>
  );
};
