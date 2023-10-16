import { useContext, useEffect, useState } from "react";
import { sortDashboards } from "../utils/utils";
import { useParams, useHistory } from "react-router-dom";
import { ExtensionContext } from "@looker/extension-sdk-react";

export const useInitTabs = ({
  appConfig,
  setAppAlert,
  setSelectedDashboardId,
  isCheckingAdminUser,
  isAdminUser,
}) => {
  const urlParams = useParams();
  const history = useHistory();
  const { core40SDK: sdk } = useContext(ExtensionContext);

  // fetch folder dashboards on load
  const [isInitializingTabs, setIsInitializingTabs] = useState(true);
  const [tabData, setTabData] = useState([]);

  const getFolderDashboards = async (folderId, responseMap) => {
    const response = await sdk.ok(sdk.folder_dashboards(folderId, "id, title"));
    responseMap[folderId] = response;
  };

  const initTabs = async (tabs) => {
    setIsInitializingTabs(true);
    const responseMap = {};
    try {
      const tabsDashboardPromises = [];
      tabs.forEach(async (tab) => {
        tabsDashboardPromises.push(
          getFolderDashboards(tab.folderId, responseMap)
        );
        if (tab.children?.length) {
          tab.children.forEach((nestedTab) => {
            tabsDashboardPromises.push(
              getFolderDashboards(nestedTab.folderId, responseMap)
            );
          });
        }
      });

      const settledDashboardPromises = await Promise.allSettled(
        tabsDashboardPromises
      );

      // const tabDashboards = tabDashboardsResponses.reduce((acc, response) => {
      //   if (response.status === "fulfilled") {
      //     acc.push(response.value);
      //   }
      //   return acc;
      // }, []);

      const newTabData = tabs.map((tab) => {
        const formattedTab = {
          name: tab.name,
          dashboards: responseMap[tab.folderId],
          dashboardSortOrder: tab.dashboardSortOrder,
        };
        if (tab.children?.length) {
          formattedTab.children = tab.children.map((nestedTab) => ({
            name: nestedTab.name,
            dashboards: responseMap[nestedTab.folderId],
            dashboardSortOrder: nestedTab.dashboardSortOrder,
          }));
        }
        return formattedTab;
      });

      // tabs.forEach((tab, index) => {
      //   if (tabDashboardsResponses[index].status === "fulfilled") {
      //     newTabData.push({
      //       name: tab.name,
      //       dashboards: responseMap[index],
      //       dashboardSortOrder: tab.dashboardSortOrder,
      //     });
      //   }
      // });
      setTabData(newTabData);

      if (
        isAdminUser &&
        settledDashboardPromises.some(
          (response) => response.status === "rejected"
        )
      ) {
        setAppAlert({
          message:
            "Unable to fetch one or more of the folders defined in the admin configuration. Please check whether all the defined folders exist, or you have access to them.",
          type: "warning",
        });
      }

      // If fetched tabs contain the dashboard ID from url params, use url param as default dashboard.
      // Otherwise, use first dashboard of first tab as default.
      const dashboards = Object.values(responseMap).reduce((a, b) => [
        ...a,
        ...b,
      ]);
      const tabsContainUrlParamsDashboard = dashboards.some(
        (dashboard) => dashboard.id === urlParams.dashboardId
      );
      if (tabsContainUrlParamsDashboard) {
        setSelectedDashboardId(urlParams.dashboardId);
      } else {
        const { dashboards: firstTabDashboards } = newTabData[0];
        let defaultSelectedDashboard;
        if (newTabData[0].dashboardSortOrder) {
          const sortedDashboards = sortDashboards(
            firstTabDashboards,
            newTabData[0].dashboardSortOrder
          );
          defaultSelectedDashboard = sortedDashboards[0].id;
        } else {
          defaultSelectedDashboard = newTabData[0].dashboards[0]?.id;
        }
        setSelectedDashboardId(defaultSelectedDashboard);
        history.push(`/${defaultSelectedDashboard}`);
      }
    } catch (e) {
      setAppAlert("Error fetching Looker dashboards");
      console.error("Error fetching Looker dashboards: ", e);
    }
    setIsInitializingTabs(false);
  };

  useEffect(() => {
    if (!!appConfig?.tabs?.[0]?.folderId) {
      if (isCheckingAdminUser) {
        return;
      }
      initTabs(appConfig.tabs);
    } else {
      setIsInitializingTabs(false);
    }
  }, [appConfig, isCheckingAdminUser]);

  return {
    isInitializingTabs,
    tabData,
  };
};
