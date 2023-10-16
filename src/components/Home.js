import React, { createContext, useEffect, useState, useContext } from "react";
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
  const [isLoadingContextData, setIsLoadingContextData] = useState(true);
  const [fieldNameSuggestions, setFieldNameSuggestions] = useState([])


  const [reload, setReload] = useState({});


  useEffect(() => {
    const getSuggestions = (filter) => {
      // console.log(":::FILTER", filter)
      return sdk.ok(sdk.model_fieldname_suggestions({
        model_name: filter.model,
        view_name: filter.explore,
        field_name: filter.dimension
      }))
        .then((res) => res)
        .catch(() => ({}));
    }

    const getDashboardFilter = async () => {
      try {
        const response = await sdk.ok(sdk.dashboard(selectedDashboardId, 'dashboard_filters'));
        const filters = response?.dashboard_filters || [];

        const suggestionsPromises = filters.map((filter) => getSuggestions(filter));

        const suggestionsResults = await Promise.all(suggestionsPromises);
        setFieldNameSuggestions(suggestionsResults);
      } catch (error) {
        console.log("Error getting FILTERS:", error);
      }
    }

    getDashboardFilter();
  }, [selectedDashboardId]);




  const fallbackAppConfig = {
    showDashboardFilters: true,
    dashboardTheme: "Looker",
    showTabIcons: true,
    tabs: [
      {
        name: "",
        basicContentFolderId: null,
      },
    ],
  };
  const [appConfig, setAppConfig] = useState();
  const reloadPage = (val) => {
    setAppConfig({
      ...val,
    });
  };
  const getContextData = async () => {

    console.log('refreshing it after ', appConfig)
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





  useEffect( () => {

   sdk.ok(sdk.dashboard(selectedDashboardId, 'dashboard_filters')).then((res) => {

   // console.log(res, selectedDashboardId, "DASHBOARD FILTERS");


    })

  }, [selectedDashboardId]);


  useEffect(() => {
    console.log('field Name Suggession', fieldNameSuggestions)
  }, [fieldNameSuggestions]
  )




  return (
    <AppAlertContext.Provider value={setAppAlert}>
      <Box height="100%" display="flex" flexDirection="column">
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
                    <EmbedDashboard
                      dashboardId={selectedDashboardId}
                      showDashboardFilters={appConfig?.showDashboardFilters}
                    />
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
