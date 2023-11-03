import React, { Fragment, useState, useEffect } from "react";
import { useHistory, useLocation } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Box,
} from "@mui/material";


// import { Icon, MenuItem, PanelMenu, Tooltip } from "@sabre/spark-react-core";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import {
  Accordion,
  Col,
  Container,
  Row,
} from "react-bootstrap";


const ExpandableListItem = ({
  children,
  handleSelection,
  isExpanded,
  label,
  selected,
  sx,
  addLink,
  link,
  updateLink
}) => {
  return (
    <>
      <ListItemButton onClick={handleSelection} selected={selected}>
        <ListItemText primary={label} sx={sx}  />
        {isExpanded ? (
          <ExpandLess color="primary" />
        ) : (
          <ExpandMore color="primary" />
        )}
      </ListItemButton>
      <Collapse in={isExpanded}>{children}</Collapse>
    </>
  );
};

export const NestedList = ({
  listItems,
  openItems,
  setOpenItems,
  selectedItem,
  setSelectedItem,
  baseUrl,
  otherUrl,
  appConfig,
  selectedDashboardId,
  setSelectedDashboardId
}) => {
  const handleSelection = (value) => {
    setSelectedItem(value);
  };

  const handleDropdownSelection = (listSummaryIndex) => {
    if (openItems.includes(listSummaryIndex)) {
      setOpenItems((prev) => prev.filter((i) => i !== listSummaryIndex));
    } else {
      setOpenItems((prev) => [...prev, listSummaryIndex]);
    }
  };





  const drawerOpenKey = 'drawerOpen';
  const defaultOpen = localStorage.getItem(drawerOpenKey) === 'true';
  const [open, setOpen] = React.useState(defaultOpen);

  React.useEffect(() => {
    localStorage.setItem(drawerOpenKey, open);
  }, [open]);

  const handleDrawerOpen = () => {
    setOpen(true);

  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  console.log(baseUrl, otherUrl, "elizabeth")


  return (
    <Fragment>

      <List

      disablePadding>
        {listItems.map((listItem, index) => (
          <Box
            key={listItem.label}
            sx={{
              borderBottom: "1px solid lightgrey",
              borderImage:
                "linear-gradient( to right, rgba(0, 0, 0, 0), lightgrey, rgba(0, 0, 0, 0) ) 9 20",
            }}
          >
            <ExpandableListItem

              handleSelection={() => handleDropdownSelection(`${index}`)}
              isExpanded={openItems.includes(`${index}`)}
              label={listItem.label}
              selected={
                listItem.children.some((item) => item.value === selectedItem) &&
                !openItems.includes(`${index}`)
              }
            >
              <List disablePadding>
                {listItem.children.map((child, childIndex) =>
                  child.children ? (
                    <ExpandableListItem

                      handleSelection={() =>
                        handleDropdownSelection(`${index}-${childIndex}`)
                      }
                      isExpanded={openItems.includes(`${index}-${childIndex}`)}
                      key={child.label}
                      label={child.label}
                      selected={
                        child.children.some(
                          (item) => item.value === selectedItem
                        ) && !openItems.includes(`${index}`)
                      }
                      sx={{ marginLeft: 2 }}
                    >
                      {child.children.map((child, childIndex) => (
                        <ListItem
                        className="spark-menu__list-item"
                        style={{ pointerEvents: 'none' }} component='a' href={`${baseUrl}/spartan/gcp_billing::dashboard_navigation_test/${child.value}`} disablePadding key={child.value}>
                          <ListItemButton
                            style={{ pointerEvents: 'auto' }}
                            onClick={(e) => {
                              e.preventDefault();
                              handleSelection(child.value)
                            }}
                            selected={child.value === selectedItem}
                          >
                            <ListItemText
                              secondary={child.label}
                              sx={{ marginLeft: 4 }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </ExpandableListItem>
                  ) : (
                    <ListItem
                    className="spark-menu__list-item"
                    style={{ pointerEvents: 'none' }} component='a' href={`${baseUrl}/spartan/gcp_billing::dashboard_navigation_test/${child.value}`} disablePadding key={child.value}>
                      <ListItemButton
                        style={{ pointerEvents: 'auto' }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleSelection(child.value)
                        }}
                        selected={child.value === selectedItem}
                      >
                        <ListItemText
                          secondary={child.label}
                          sx={{ marginLeft: 2 }}
                        />
                      </ListItemButton>
                    </ListItem>
                  )
                )}
              </List>
            </ExpandableListItem>
          </Box>
        ))}




        <Accordion defaultActiveKey="0" className={appConfig?.links?.length > 0 ? "" : "hidden"}>

          <Accordion.Item eventKey="1">
            <Accordion.Header>External Links</Accordion.Header>
            <Accordion.Body className="moveLeft">
              {
                appConfig?.links?.filter((tab) => tab.linkName && tab.studioLink)?.map((tab, index) => {
                  return (
                    <ListItem key={index} component='a'
                      target="_blank"
                      href={tab.studioLink}
                      disablePadding>
                      <ListItemButton
                      >
                        <ListItemText
                          secondary={tab.linkName}
                          sx={{ marginLeft: 2 }}
                        />
                      </ListItemButton>
                    </ListItem>
                  )
                })
              }
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

      </List>






    </Fragment>
  );
};
