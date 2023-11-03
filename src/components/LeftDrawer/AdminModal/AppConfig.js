import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  IconButton,
  List,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";
import { ExtensionContext } from "@looker/extension-sdk-react";
import { LoadingButton } from "@mui/lab";
import {
  CreateNewFolder,
  Delete,
  FileUpload,
  SubdirectoryArrowRight,
  SwapVert,
} from "@mui/icons-material";

import { DialogContentSection } from "./DialogContentSection";
import produce from "immer";
import defaultLogo from "../../../assets/BytecodeLogo.png";
import { defaultLogoHeight } from "../../../utils/constants";
import Dropzone from "react-dropzone";

import { GCloud } from "../../_lowLevel/GCloud";

const LinkConfigRow = ({ tabIndex, tab, updateTab, removeLink }) => (
  <>
    <Grid
      container
      spacing={2}
      pl={2}
      py={2}
      width="100%"
      className="d-flex justify-content-start"
    >
      <Grid item xs={3}>
        <FormControl sx={{ width: "100%" }}>
          <TextField
            value={tab.linkName}
            onChange={(e) => updateTab("linkName", e.target.value, tabIndex)}
            variant="outlined"
            label="Add Link Name"
            size="small"
            sx={{ width: "100%" }}
          />
        </FormControl>
      </Grid>

      <Grid item xs={3}>
        <FormControl sx={{ width: "100%" }}>
          <TextField
            value={tab.studioLink}
            onChange={(e) => updateTab("studioLink", e.target.value, tabIndex)}
            variant="outlined"
            label="Add Studio Link"
            size="small"
            sx={{ width: "100%" }}
          />
        </FormControl>
      </Grid>
      <Grid item xs="auto">
        <Tooltip title="Remove Tab">
          <IconButton onClick={() => removeLink(tabIndex)}>
            <i class="fal fa-trash-alt adminMenu"></i>
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>

    {/*<Grid item xs>
      <FormControl sx={{ width: "100%" }}>

        <TextField
          value={link.linkName}
          onChange={(e) => updateLink("linkName", e.target.value, linkIndex)}
          variant="outlined"
          label="Add Link Name"
          size="small"
          sx={{ width: "100%" }}
        />
      </FormControl>
    </Grid>

      <Grid item xs>
      <FormControl sx={{ width: "100%" }}>

        <TextField
          value={link.studioLink}
          onChange={(e) => updateLink("studioLink", e.target.value, linkIndex)}
          variant="outlined"
          label="Add Studio Link"
          size="small"
          sx={{ width: "100%" }}
        />
      </FormControl>
    </Grid>


    </Grid>*/}
  </>
);

const TabConfigRow = ({
  addNestedTab,
  tabIndex,
  tab,
  updateNestedTab,
  updateTab,
  removeNestedTab,
  removeTab,
  setSelectedTab,
  allGroups,
  addLink,
  link,
  updateLink,
}) => (
  <>
    <Grid
      container
      spacing={2}
      pl={2}
      py={2}
      width="100%"
      className="d-flex justify-content-start"
    >
      <Grid item xs>
        <TextField
          value={tab.name}
          onChange={(e) => updateTab("name", e.target.value, tabIndex)}
          variant="outlined"
          label={`Tab ${tabIndex + 1} Name`}
          size="small"
          sx={{ width: "100%" }}
        />
      </Grid>
      <Grid item xs>
        <TextField
          value={tab.folderId}
          onChange={(e) => updateTab("folderId", e.target.value, tabIndex)}
          variant="outlined"
          label={`Folder ID`}
          size="small"
          sx={{ width: "100%" }}
        />
      </Grid>

      <Grid item xs={2}>
        <FormControl sx={{ width: "100%" }}>
          <InputLabel id="groups-visible-to-label">
            Groups Visible To
          </InputLabel>
          <Select
           id="smallFont"
            labelId="groups-visible-to-label"
            multiple
            onChange={(e) => {
              const newValue =
                typeof e.target.value === "string"
                  ? e.target.value.split(",")
                  : e.target.value;
              updateTab("groupsVisibleTo", newValue, tabIndex);
            }}
            size="small"
            value={tab.groupsVisibleTo ?? []}
          >
            {allGroups.map((group) => (
              <MenuItem

              size="small" key={group.id} value={group.id}>
                {group.name}
              </MenuItem>
            ))}
            {allGroups.map((group) => {
              console.log(group, "group");
            })}
          </Select>
        </FormControl>
      </Grid>

      {/* <Grid item xs={2}>
        <FormControl sx={{ width: "100%" }}>

          <TextField
            value={tab.linkName}
            onChange={(e) => updateTab("linkName", e.target.value, tabIndex)}
            variant="outlined"
            label="Add Link Name"
            size="small"
            sx={{ width: "100%" }}
          />
        </FormControl>
      </Grid> */}

      {/* <Grid item xs={2}>
        <FormControl sx={{ width: "100%" }}>

          <TextField
            value={tab.studioLink}
            onChange={(e) => updateTab("studioLink", e.target.value, tabIndex)}
            variant="outlined"
            label="Add Studio Link"
            size="small"
            sx={{ width: "100%" }}
          />
        </FormControl>
      </Grid> */}

      <Grid item xs="auto">
        <Tooltip title="Add Nested Tab">
          <IconButton
            onClick={() => addNestedTab(tabIndex)}
            sx={{
              visibility: tab.children?.length ? "hidden" : "visible",
            }}
          >
            <CreateNewFolder />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item xs="auto">
        <Tooltip title="Sort Tab Dashboards">
          <IconButton
            className="arrows"
            onClick={() =>
              setSelectedTab({ tabIndex, nestedTabIndex: undefined })
            }
          >
            <i class="fal fa-arrows-v adminMenu"></i>
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item xs="auto">
        <Tooltip title="Remove Tab">
          <IconButton className="trash" onClick={() => removeTab(tabIndex)}>
            <i class="fal fa-trash-alt adminMenu"></i>
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
    {tab.children?.map((nestedTab, nestedTabIndex) => (
      <Grid
        container
        spacing={2}
        pl={2}
        py={2}
        width="100%"
        key={nestedTabIndex}
        className="d-flex justify-content-center"
      >
        <Grid item xs="auto" className="larger">
          <SubdirectoryArrowRight
            sx={{ color: "rgba(0, 0, 0, 0.54)", pr: 1 }}
          />
        </Grid>
        <Grid item xs>
          <Box pr={2}>
            <TextField
              value={nestedTab.name}
              onChange={(e) =>
                updateNestedTab(
                  "name",
                  e.target.value,
                  tabIndex,
                  nestedTabIndex
                )
              }
              variant="outlined"
              label={`Tab ${tabIndex + 1}-${nestedTabIndex + 1} Name`}
              size="small"
              sx={{ width: "100%", pr: 2 }}
            />
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box pr={1}>
            <TextField
              value={nestedTab.folderId}
              onChange={(e) =>
                updateNestedTab(
                  "folderId",
                  e.target.value,
                  tabIndex,
                  nestedTabIndex
                )
              }
              variant="outlined"
              label={`Folder ID`}
              size="small"
              sx={{ width: "100%" }}
            />
          </Box>
        </Grid>

        <Grid item xs={3}>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel id="groups-visible-to-label">
              Groups Visible To
            </InputLabel>
            <Select
              id="smallFont"
              labelId="groups-visible-to-label"
              multiple
              onChange={(e) => {
                const newValue =
                  typeof e.target.value === "string"
                    ? e.target.value.split(",")
                    : e.target.value;
                updateNestedTab(
                  "groupsVisibleTo",
                  newValue,
                  tabIndex,
                  nestedTabIndex
                );
              }}
              size="small"
              value={nestedTab.groupsVisibleTo ?? []}
            >
              {allGroups.map((group) => (
                <MenuItem

                 size="small" key={group.id} value={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs="auto">
          <Tooltip
            title="Add Nested Tab"
            sx={{
              visibility:
                nestedTabIndex === tab.children.length - 1
                  ? "visible"
                  : "hidden",
            }}
          >
            <IconButton
              className="circle"
              onClick={() => addNestedTab(tabIndex)}
            >
              <i class="fal fa-plus-circle adminMenu"></i>
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs="auto">
          <Tooltip title="Sort Tab Dashboards">
            <IconButton
              className="arrows"
              onClick={() => setSelectedTab({ tabIndex, nestedTabIndex })}
            >
              <i class="fal fa-arrows-v adminMenu"></i>
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs="auto">
          <Tooltip title="Remove Tab">
            <IconButton
              className="trash"
              onClick={() => removeNestedTab(tabIndex, nestedTabIndex)}
            >
              <i class="fal fa-trash-alt adminMenu"></i>
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    ))}
  </>
);

export const AppConfig = ({
  tempAppConfig,
  setTempAppConfig,
  saveConfigChanges,
  isSavingConfig,
  closeModal,
  setSelectedTab,
  appAlert,
  setAppAlert,
}) => {
  const { core40SDK: sdk } = useContext(ExtensionContext);

  // Get all Looker groups on load
  const [allGroups, setAllGroups] = useState([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const fetchLookerGroups = async () => {
    try {
      const groups = await sdk.ok(
        sdk.all_groups({
          fields: "id, name",
        })
      );
      setAllGroups(groups);

      console.log(groups, "what are the groups");
      setIsLoadingGroups(false);
    } catch (e) {
      setAppAlert({
        message: "Error loading Looker groups",
        type: "error",
      });
      setIsLoadingGroups(false);
    }
  };
  useEffect(() => {
    fetchLookerGroups();
  }, []);

  // console.log(allGroups, "what are the groups")

  const emptyLink = { studioLink: "", linkName: "" };

  const addLink = () => {
    setTempAppConfig((prev) =>
      produce(prev, (draft) => {
        draft.links.push(emptyLink);
      })
    );
  };

  const removeLink = (linkIndex) => {
    setTempAppConfig((prev) => ({
      ...prev,
      links: prev.links.filter((link, index) => index !== linkIndex),
    }));
  };

  const updateLink = (property, newValue, linkIndex) => {
    setTempAppConfig((prev) => {
      const newLinks = [...prev.links];
      newLinks[linkIndex] = {
        ...newLinks[linkIndex],
        [property]: newValue,
      };
      return {
        ...prev,
        links: newLinks,
      };
    });
  };

  const emptyTab = { name: "", folderId: "", dashboardSortOrder: [] };
  // Add/remove tab inputs
  const addTab = () => {
    setTempAppConfig((prev) =>
      produce(prev, (draft) => {
        draft.tabs.push(emptyTab);
      })
    );
  };

  const removeTab = (tabIndex) => {
    setTempAppConfig((prev) => ({
      ...prev,
      tabs: prev.tabs.filter((tab, index) => index !== tabIndex),
    }));
  };

  // Update state when tab input values change
  const updateTab = (property, newValue, tabIndex) => {
    setTempAppConfig((prev) => {
      const newTabs = [...prev.tabs];
      newTabs[tabIndex] = {
        ...newTabs[tabIndex],
        [property]: newValue,
      };
      return {
        ...prev,
        tabs: newTabs,
      };
    });
  };

  const addNestedTab = (tabIndex) => {
    setTempAppConfig((prev) =>
      produce(prev, (draft) => {
        if (!draft.tabs[tabIndex].children) {
          draft.tabs[tabIndex].children = [];
        }
        draft.tabs[tabIndex].children.push(emptyTab);
      })
    );
  };

  const removeNestedTab = (tabIndex, nestedTabIndex) => {
    setTempAppConfig((prev) =>
      produce(prev, (draft) => {
        draft.tabs[tabIndex].children = draft.tabs[tabIndex].children.filter(
          (nestedTab, index) => index !== nestedTabIndex
        );
      })
    );
  };

  // Update state when nested tab input values change
  const updateNestedTab = (property, newValue, tabIndex, nestedTabIndex) => {
    setTempAppConfig((prev) =>
      produce(prev, (draft) => {
        draft.tabs[tabIndex].children[nestedTabIndex][property] = newValue;
      })
    );
  };

  // update state from app and dashboard form fields
  const updateConfig = (configValueName, newValue) => {
    setTempAppConfig((prev) =>
      produce(prev, (draft) => {
        draft[configValueName] = newValue;
      })
    );
  };

  // handle logo image upload
  const handleFileUpload = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onabort = () => console.log("File reading was aborted");
    reader.onerror = () => console.error("File reading failed");
    reader.onload = () => {
      const dataURL = reader.result;
      updateConfig("logoDataURL", dataURL);
    };

    reader.readAsDataURL(file);
  }, []);

  return (
    <>
      <DialogContent>
        {/*<DialogContentSection headingText="App" top>
          <Stack alignItems="flex-start" spacing={3}>
            <TextField
              value={tempAppConfig.logoHeight ?? defaultLogoHeight}
              onChange={(e) => updateConfig("logoHeight", e.target.value)}
              variant="outlined"
              label={`Logo Height (px)`}
              size="small"
              sx={{ pb: 1 }}
            />
            <Stack direction="row" spacing={2} alignItems="center">
              <Dropzone onDrop={handleFileUpload}>
                {({ getRootProps, getInputProps }) => (
                  <Button
                    {...getRootProps()}
                    component="span"
                    variant="contained"
                    size="small"
                    startIcon={<FileUpload />}
                  >
                    Update Logo
                    <input {...getInputProps()} />
                  </Button>
                )}
              </Dropzone>
              <img
                src={
                  tempAppConfig.logoDataURL
                    ? tempAppConfig.logoDataURL
                    : defaultLogo
                }
                alt="company logo"
                height={
                  tempAppConfig.logoHeight
                    ? `${tempAppConfig.logoHeight}px`
                    : `${defaultLogoHeight}px`
                }
              />
            </Stack>
          </Stack>
        </DialogContentSection>*/}
        <DialogContentSection headingText="Dashboard" top>
          <FormControlLabel
            control={
              <Switch
                checked={tempAppConfig.showDashboardFilters}
                onChange={(event) =>
                  updateConfig("showDashboardFilters", event.target.checked)
                }
              />
            }
            label="Show Dashboard Filters"
          />
        </DialogContentSection>
        <DialogContentSection headingText="Tab Navigation">
          <Stack alignItems="flex-start">
            {tempAppConfig.tabs?.map((tab, tabIndex) => (
              <TabConfigRow
                addNestedTab={addNestedTab}
                tabIndex={tabIndex}
                tab={tab}
                updateNestedTab={updateNestedTab}
                updateTab={updateTab}
                key={tabIndex}
                removeNestedTab={removeNestedTab}
                removeTab={removeTab}
                showTabIcons={tempAppConfig.showTabIcons}
                setSelectedTab={setSelectedTab}
                allGroups={allGroups}
              />
            ))}
            <Button
              id="spark"
              variant="contained"
              sx={{ my: 2 }}
              onClick={addTab}
            >
              Add Tab
            </Button>
          </Stack>
        </DialogContentSection>

        <DialogContentSection headingText="Link Navigation">
          <Stack alignItems="flex-start">
            {tempAppConfig.links?.map((tab, tabIndex) => (
              <LinkConfigRow
                tabIndex={tabIndex}
                tab={tab}
                updateTab={updateLink}
                key={tabIndex}
                removeLink={removeLink}
              />
            ))}
            <Button id="spark" sx={{ my: 2 }} onClick={addLink}>
              Add Links
            </Button>
          </Stack>

          <GCloud />
        </DialogContentSection>
      </DialogContent>
      <DialogActions>
        <Button id="spark" onClick={closeModal}>
          Cancel
        </Button>
        <LoadingButton
          id="sparkReverse"
          loading={isSavingConfig}
          variant="contained"
          onClick={() => saveConfigChanges(tempAppConfig)}
        >
          Save Changes
        </LoadingButton>
      </DialogActions>
    </>
  );
};
