import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Card,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from "@mui/material";
import { DialogContentSection } from "./DialogContentSection";
import { ExtensionContext } from "@looker/extension-sdk-react";
import { AppLoadingSpinner } from "../../_lowLevel/AppLoadingSpinner";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import produce from "immer";

const getTabByMap = (appConfig, selectedTabMap) => {
  const { tabIndex, nestedTabIndex } = selectedTabMap;
  if (nestedTabIndex !== undefined) {
    return appConfig.tabs[tabIndex].children[nestedTabIndex];
  }
  return appConfig.tabs[tabIndex];
};

export const DashboardSort = ({
  tempAppConfig,
  setTempAppConfig,
  selectedTab,
  setSelectedTab,
}) => {
  const { core40SDK: sdk } = useContext(ExtensionContext);

  const tab = getTabByMap(tempAppConfig, selectedTab);

  const { tabIndex, nestedTabIndex } = selectedTab;
  const isNestedTab = nestedTabIndex !== undefined;

  const setDashboardSort = (newDashboardSort) => {
    setTempAppConfig((prevConfig) =>
      produce(prevConfig, (newConfig) => {
        if (isNestedTab) {
          newConfig.tabs[tabIndex].children[nestedTabIndex].dashboardSortOrder =
            newDashboardSort;
        } else {
          newConfig.tabs[tabIndex].dashboardSortOrder = newDashboardSort;
        }
      })
    );
  };

  const updateDashboardSort = (result) => {
    if (!result.destination) {
      return;
    }
    const newDashboardSort = sortedDashboards.map((d) => d.id);
    // remove changed dashboard from original location
    const [reorderedDashboard] = newDashboardSort.splice(
      result.source.index,
      1
    );
    // add changed dashboard to new location
    newDashboardSort.splice(result.destination.index, 0, reorderedDashboard);
    setDashboardSort(newDashboardSort);
  };

  // Fetch tab dashboards on page load
  const [isLoadingDashboards, setIsLoadingDashboards] = useState(true);
  const [dashboards, setDashboards] = useState();
  const getFolderDashboards = async (folderId) =>
    sdk.ok(sdk.folder_dashboards(folderId, "id, title"));

  const getTabDashboards = async () => {
    try {
      const dashboards = await getFolderDashboards(tab.folderId);

      if (!tab.dashboardSortOrder) {
        const defaultDashboardSort = dashboards.map((d) => d.id);
        setDashboardSort(defaultDashboardSort);
      }

      setDashboards(dashboards);
    } catch (e) {
      console.error("Error loading dashboards: ", e);
    }
    setIsLoadingDashboards(false);
  };

  useEffect(() => {
    getTabDashboards();
  }, []);

  const sortedDashboards = dashboards?.sort((a, b) => {
    const { dashboardSortOrder } = tab;
    if (!dashboardSortOrder) {
      return 0;
    }

    if (
      dashboardSortOrder.includes(a.id) &&
      dashboardSortOrder.includes(b.id)
    ) {
      return (
        dashboardSortOrder.indexOf(a.id) - dashboardSortOrder.indexOf(b.id)
      );
    } else if (dashboardSortOrder.includes(a.id)) {
      return -1;
    } else if (dashboardSortOrder.includes(b.id)) {
      return 1;
    } else {
      return 0;
    }
  });

  return (
    <>
      <DragDropContext onDragEnd={updateDashboardSort}>
        <DialogContent>
          <DialogContentSection
            headingText={`Sort Dashboards - ${tab.name}`}
            top
          >
            {isLoadingDashboards ? (
              <AppLoadingSpinner />
            ) : dashboards ? (
              <Stack
                sx={{
                  textAlign: "center",
                }}
              >
                <Typography sx={{ margin: "30px 0" }}>
                  Click and drag the dashboards below to sort.
                </Typography>
                <Droppable droppableId="dashboardSortList">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {sortedDashboards &&
                        sortedDashboards.map((dashboard, i) => (
                          <Draggable
                            key={dashboard.id}
                            draggableId={dashboard.id}
                            index={i}
                          >
                            {(provided) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{ margin: "10px 30px", padding: "5px" }}
                              >
                                <Typography>{dashboard.title}</Typography>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Stack>
            ) : (
              <Typography>
                Error loading dashboards. Please check the folder IDs and folder
                contents for this tab.
              </Typography>
            )}
          </DialogContentSection>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedTab(undefined)} size="sm">
            Done
          </Button>
        </DialogActions>
      </DragDropContext>
    </>
  );
};
