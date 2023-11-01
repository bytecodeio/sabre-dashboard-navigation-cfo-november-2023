import React, { useState } from "react";
import { Box, Button, Drawer } from "@mui/material";
import { NestedList } from "../_lowLevel/NestedList";
import { AdminModal } from "./AdminModal/AdminModal";
import SettingsIcon from "@mui/icons-material/Settings";

export const LeftDrawer = ({
  heightOffset,
  drawerWidth,
  isOpen,
  drawerListItems,
  selectedItem,
  setSelectedItem,
  appConfig,
  isAdminUser,
  refreshPayload
}) => {
  const [openItems, setOpenItems] = useState([]);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  return (
    <Drawer
      anchor="left"
      variant="persistent"
      open={isOpen}
      sx={{
        height: "100%",
        "> div": {
          marginTop: heightOffset,
          borderRight: "1px solid #E8E8E8",
          backgroundColor: "secondary",
          height: `calc(100% - ${heightOffset})`,
        },
      }}
    >
      <Box
        width={drawerWidth}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        flexGrow={1}
      >
        {appConfig?.tabs?.length > 0  || appConfig?.links?.length > 0 ? (
          <NestedList
            listItems={drawerListItems}
            openItems={openItems}
            setOpenItems={setOpenItems}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            baseUrl={appConfig.baseUrl}
            otherUrl={appConfig.otherUrl}
            appConfig={appConfig}

          />
        ) : (
          <div />
        )}
        {isAdminUser && (
          <Box
            id="center"
            sx={{
              borderTop: "1px solid lightgrey",
              borderImage:
                "linear-gradient( to right, rgba(0, 0, 0, 0), lightgrey, rgba(0, 0, 0, 0) ) 9 20",
              padding: "5px 10px",
            }}
          >
            <Button
              id="spark"
              className="spark-btn spark-btn--sm spark-btn--secondary"
            
              onClick={() => setIsAdminModalOpen(true)}
            >
              Admin
            </Button>
            <AdminModal
              refreshPayload={refreshPayload}
              isOpen={isAdminModalOpen}
              setIsOpen={setIsAdminModalOpen}
              appConfig={appConfig}
            />
          </Box>
        )}
      </Box>
    </Drawer>
  );
};
