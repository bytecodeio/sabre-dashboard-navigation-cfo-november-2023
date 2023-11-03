import React, { useContext, useState } from "react";
import { ExtensionContext } from "@looker/extension-sdk-react";
import {
  Dialog,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import _ from "lodash";
import { AppAlertContext } from "../../Home";
import { AppConfig } from "./AppConfig";
import { DashboardSort } from "./DashboardSort";


export const AdminModal = ({ isOpen, setIsOpen, appConfig, refreshPayload }) => {
  const { extensionSDK } = useContext(ExtensionContext);
  const setAppAlert = useContext(AppAlertContext);
  const [selectedTab, setSelectedTab] = useState();

  const defaultTempAppConfig = {
    ...appConfig,
    tabs: appConfig?.tabs || [],
    links: appConfig?.links || []
  };
  const [tempAppConfig, setTempAppConfig] = useState(defaultTempAppConfig);
  // Save config changes
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const saveConfigChanges = async (newAppConfig) => {
    setIsSavingConfig(true);
    try {
      await extensionSDK.saveContextData(newAppConfig);
      setIsSavingConfig(false);
      setIsOpen(false);
      // refreshPayload(newAppConfig)
      setAppAlert({
        message:
          "Successfully saved app configuration. Please reload the page.",
        type: "success",
      });
    } catch (e) {
      setIsSavingConfig(false);
      setAppAlert({
        message: "Error saving new app configuration",
        type: "error",
      });
      console.error("Error saving new context data: ", e);
    }
  };

  //
  // console.log(tempAppConfig, "elizabeth")
  // console.log(isSavingConfig, "what is this")


  return (
    <Dialog open={isOpen} fullWidth maxWidth="none" id="adminModal">
      <DialogTitle>
        <Stack
          id="center"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5 text-center">App Configuration</Typography>
          <IconButton
          id="closeIt"
          onClick={() => setIsOpen(false)}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Divider variant="middle" />
      {selectedTab === undefined ? (
        <AppConfig
          tempAppConfig={tempAppConfig}
          setTempAppConfig={setTempAppConfig}
          saveConfigChanges={saveConfigChanges}
          setSelectedTab={setSelectedTab}
          closeModal={() => setIsOpen(false)}
        />
      ) : (
        <DashboardSort
          tempAppConfig={tempAppConfig}
          setTempAppConfig={setTempAppConfig}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      )}
    </Dialog>
  );
};
