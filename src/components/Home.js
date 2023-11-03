import React, { Fragment, createContext, useEffect, useState, useContext } from "react";
import "normalize.css";
import { ExtensionContext } from "@looker/extension-sdk-react";
import { TopAppBar } from "./TopAppBar/TopAppBar";
import { AppLoadingSpinner } from "./_lowLevel/AppLoadingSpinner";
import { LeftDrawer } from "./LeftDrawer/LeftDrawer";
import { EmbedDashboard } from "./EmbedDashboard/EmbedDashboard";
import { Alert, Box, Snackbar } from "@mui/material";
import { ErrorBoundary } from "./_lowLevel/ErrorBoundary";
import { drawerWidth, toolbarHeight } from "../utils/constants";
import { useIsUserAdmin } from "../hooks/useIsUserAdmin";
import { useInitTabs } from "../hooks/useInitTabs";
import { sortDashboards } from "../utils/utils";
import { useHistory } from "react-router-dom";
import { useExtensionContext } from "../hooks/useExtensionContext";

import {
  LOOKER_MODEL,
  LOOKER_EXPLORE,
  TAGKEYS,
  DASHBOARD_ID,
} from "./../utils/constants.js";

export const AppAlertContext = createContext();

export const Home = () => {
  const history = useHistory();
  const { core40SDK: sdk, extensionSDK } = useContext(ExtensionContext);

  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(true);
  const [selectedDashboardId, setSelectedDashboardId] = useState();
  const [selectedDashboardFilters, setSelectedDashboardFilters] = useState();

  const [fieldNameSuggestions, setFieldNameSuggestions] = useState([]);
const [selectedCheckboxes, setSelectedCheckboxes] = useState({});

  const [fieldOptions, setFieldOptions] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);

  const { isLoadingContextData, appConfig } = useExtensionContext();

  // get application context data on load
  const [reload, setReload] = useState({});

  const [boardTitle, setBoardTitle] = useState([]);

  useEffect(() => {
    const getSuggestions = (filter) => {
      return sdk
        .ok(
          sdk.model_fieldname_suggestions({
            model_name: filter.model,
            view_name: filter.explore,
            field_name: filter.dimension,
          })
        )
        .then((res) => {
          return {
            ...filter,
            ...res,
          };
        })
        .catch(() => ({}));
    };

    const getDashboardFilter = async () => {
      try {
        const filterGroups = ["button_group", "tag_list", "checkboxes"];


        const response1 = await sdk.ok(
          sdk.dashboard(selectedDashboardId)

        );


          setBoardTitle(response1.title)

        const response = await sdk.ok(
          sdk.dashboard(selectedDashboardId, "dashboard_filters")
        );

        const checkboxFilter = (filter) =>
          filterGroups.includes(filter.ui_config.type);

        const filteredFilters =
          response.dashboard_filters.filter(checkboxFilter);

        // console.log(filters, "filters");
        // console.log(filteredFilters, "filteredFilters");

        // const filters = response?.dashboard_filters || [];

        // console.log(response?.dashboard_filters, "here");

        // if (response?.dashboard_filters[0].ui_config.type == "checkboxes") {
        //   console.log("it is");

        //   console.log(filters);
        // }

        const suggestionsPromises = filteredFilters.map((filter) =>
          getSuggestions(filter)
        );

        const suggestionsResults = await Promise.all(suggestionsPromises);

        setFieldNameSuggestions(suggestionsResults);
      } catch (error) {
        console.log("Error getting FILTERS:", error);
      }
    };

    getDashboardFilter();
  }, [selectedDashboardId, boardTitle]);



  useEffect(() => {
//     console.log("field Name Suggession", fieldNameSuggestions);
//
// console.log(boardTitle, "responseElizabeth")

  }, [fieldNameSuggestions]);

  const [setIsLoadingContextData] = useState(true);
  const fallbackAppConfig = {
    showDashboardFilters: true,
    dashboardTheme: "Looker",
    showTabIcons: false,
    tabs: [
      {
        name: "",
        basicContentFolderId: null,
      },
    ],
  };
  const [setAppConfig] = useState();
  const reloadPage = (val) => {
    setAppConfig({
      ...val,
    });
  };
  const getContextData = async () => {
    console.log("refreshing it after ");
    setIsLoadingContextData(true);
    try {
      const contextData = await extensionSDK.getContextData();
      setAppConfig({
        ...fallbackAppConfig,
        ...contextData,
      });
    } catch (e) {
      setAppError(`Error loading app context data`);
      console.error("Error loading app context data: ", e);
    }
    setIsLoadingContextData(false);
  };
  useEffect(() => {
    getContextData();
  }, [reload]);

  // check whether user is an admin user on load
  const [isCheckingAdminUser, setIsCheckingAdminUser] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const checkAdminUser = async () => {
    try {
      const { id: currentUserId } = await sdk.ok(sdk.me("id"));
      const response = await sdk.ok(
        sdk.user_roles({
          user_id: currentUserId,
          fields: "name",
        })
      );
      const isAdmin = response.some(
        ({ name: roleName }) => roleName === "Admin"
      );
      setIsAdminUser(isAdmin);
    } catch (e) {
      setAppError("Error checking user admin status");
      console.error("Error checking user admin status: ", e);
    }
    setIsCheckingAdminUser(false);
  };
  useEffect(() => {
    checkAdminUser();
  }, []);

  // snackbar alert
  const defaultAppAlert = {
    message: "",
    type: "success",
  };


  const [appAlert, setAppAlert] = useState(defaultAppAlert);
  const handleSnackbarClose = () => {
    setAppAlert(defaultAppAlert);
  };
  const setAppError = (message) => setAppAlert({ message, type: "error" });

  // // fetch folder dashboards on load, after checking admin user status
  const { isInitializingTabs, tabData } = useInitTabs({
    appConfig,
    setAppAlert,
    setSelectedDashboardId,
    isCheckingAdminUser,
    isAdminUser,
  });

  const drawerListItems = tabData?.map((tab) => {
    const formatAndSortDashboards = function (dashboards, dashboardSortOrder) {
      if (!dashboards) {
        return undefined;
      }
      const sortedDashboards = dashboardSortOrder
        ? sortDashboards(dashboards, dashboardSortOrder)
        : [...dashboards];

      const formattedDashboards = sortedDashboards.map((d) => ({
        label: d.title,
        value: d.id,
      }));
      return formattedDashboards;
    };

    // format and sort tab dashboards
    const formattedDashboards = formatAndSortDashboards(
      tab.dashboards,
      tab.dashboardSortOrder
    );

    const formattedChildren = formattedDashboards
      ? [...formattedDashboards]
      : [];

    // format and prepend nested tabs
    if (tab.children?.length) {
      const formattedNestedTabs = tab.children.map((nestedTab) => {
        const formattedDashboards = formatAndSortDashboards(
          nestedTab.dashboards,
          nestedTab.dashboardSortOrder
        );
        return {
          label: nestedTab.name,
          children: formattedDashboards,
        };
      });

      formattedChildren.unshift(...formattedNestedTabs);
    }

    const listItems = {
      label: tab.name,
      children: formattedChildren,
    };

    return listItems;
  });

  // handle dashboard selection
  const handleDashboardSelection = (newDashboardId) => {
    setSelectedDashboardId(newDashboardId);
    history.push(`/${newDashboardId}`);
  };

  useEffect(() => {
    sdk
      .ok(sdk.dashboard(selectedDashboardId, "dashboard_filters"))
      .then((res) => {
        console.log(res, selectedDashboardId, "DASHBOARD FILTERS");
      });
  }, [selectedDashboardId]);

  return (
    <AppAlertContext.Provider value={setAppAlert}>
      <Box height="150%" display="flex" flexDirection="column">


        <ErrorBoundary>
          {isInitializingTabs || isCheckingAdminUser ? (
            <AppLoadingSpinner message="Loading Folders" />
          ) : (
            <>
              {appConfig?.showAppBar !== false && (
                <TopAppBar
                  appConfig={appConfig}
                  onMenuClick={() => setIsLeftDrawerOpen((prev) => !prev)}
                  toolbarHeight={toolbarHeight}
                />
              )}
              <Box flexGrow={1} display="flex">
                <LeftDrawer
                  heightOffset={
                    appConfig?.showAppBar !== false ? toolbarHeight : 0
                  }
                  drawerWidth={drawerWidth}
                  isOpen={isLeftDrawerOpen}
                  drawerListItems={drawerListItems}
                  selectedItem={selectedDashboardId}
                  setSelectedItem={handleDashboardSelection}
                  appConfig={appConfig}
                  isAdminUser={isAdminUser}
                  refreshPayload={reloadPage}
                />
                <Box
                  sx={{
                    height: "100%",
                    width: isLeftDrawerOpen
                      ? `calc(100% - ${drawerWidth})`
                      : "100%",
                    marginLeft: isLeftDrawerOpen ? drawerWidth : 0,
                    transition: (theme) =>
                      theme.transitions.create(["margin", "width"], {
                        easing: theme.transitions.easing.easeOut,
                        duration: theme.transitions.duration.enteringScreen,
                      }),
                  }}
                >

                  {appConfig?.tabs?.length > 0 ? (

                    <Fragment>

                    <p className="mb-0 left5 marginTop100">{boardTitle}</p>
                    <EmbedDashboard
                      dashboardId={selectedDashboardId}
                      showDashboardFilters={appConfig?.showDashboardFilters}
                      fieldNameSuggestions={fieldNameSuggestions}
                      setSelectedCheckboxes={setSelectedCheckboxes}
                      selectedCheckboxes={selectedCheckboxes}
                      boardTitle={boardTitle}
                      selectedDashboardId={selectedDashboardId}
                    />

                    </Fragment>


                  ) : (
                    <Alert severity="warning">
                      Please define folders in the admin config pane.
                    </Alert>
                  )}

                </Box>
              </Box>
            </>
          )}
        </ErrorBoundary>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={!!appAlert.message}
          autoHideDuration={8000}
          onClose={handleSnackbarClose}
        >
          <Alert severity={appAlert.type}>{appAlert.message}</Alert>
        </Snackbar>
      </Box>
    </AppAlertContext.Provider>
  );
};
