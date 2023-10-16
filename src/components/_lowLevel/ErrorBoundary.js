import React from "react";
import { Alert } from "@mui/material";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

const ErrorFallback = ({ error }) => (
  <>
    <Alert severity="error">{error.message}</Alert>
  </>
);

export const ErrorBoundary = ({ children }) => (
  <ReactErrorBoundary FallbackComponent={ErrorFallback}>
    {children}
  </ReactErrorBoundary>
);
