import React, { createContext, useEffect, useState, useContext } from "react";
import "normalize.css";
import { ExtensionContext } from "@looker/extension-sdk-react";

import { Accordion, AccordionButton, AccordionCollapse, AccordionContext, Alert, Anchor, Badge, Breadcrumb, BreadcrumbItem, Button, ButtonGroup, ButtonToolbar, Card, CardGroup, CardImg, Carousel, CarouselItem, CloseButton, Col, Collapse, Container, Dropdown, DropdownButton, Fade, Figure, FloatingLabel, Form, FormCheck, FormControl, FormFloating, FormGroup, FormLabel, FormSelect, FormText, Image, InputGroup, ListGroup, ListGroupItem, Modal, ModalBody, ModalDialog, ModalFooter, ModalHeader, ModalTitle, Nav, NavDropdown, NavItem, Navbar, NavbarBrand, Offcanvas, OffcanvasBody, OffcanvasHeader, OffcanvasTitle, Overlay, OverlayTrigger, PageItem, Pagination, Placeholder, PlaceholderButton, Popover, PopoverBody, PopoverHeader, ProgressBar, Ratio, Row, SSRProvider, Spinner, SplitButton, Stack, Tab, TabContainer, TabContent, TabPane, Table, Tabs, ThemeProvider, Toast, ToastBody, ToastContainer, ToastHeader, ToggleButton, ToggleButtonGroup, Tooltip} from 'react-bootstrap';



const Api = ({selectedDashboardId, setSelectedDashboardId}) => {
  const { core40SDK: sdk } = useContext(ExtensionContext);
  console.log("elizabeth")
    console.log(selectedDashboardId)


// let response = await sdk.ok(sdk.dashboard('e6IxQ2FmSwl3W8RFNk8Dqv'))

  useEffect(() => {
  const getDashboardFields = async (exploreModel, exploreName) => {
    let fields = await sdk.ok(
      sdk.lookml_model_explore(exploreModel, exploreName, 'fields')
    )
    const dimensions = fields['fields']['dimensions']
    const measures = fields['fields']['measures']

    let dims = filterOutValues(dimensions)
    let meas = filterOutValues(measures)
    let filters = dims.concat(meas)
    return {
      filters,
      measures: meas,
      dimensions: dims,
    }
  }

  // const initTabs = async () => {
  //   setIsLoadingTabs(true)
  //   const tabsList = []
  //   let counter = 0;
  //   await Promise.all(
  //     configurationData.tabs.map(async (tab, tabIndex) => {
  //       const newTab: Tab = {
  //         tabName: tab.tabName,
  //         explores: [],
  //         template: tab.dashboardTemplate,
  //       }
  //       await Promise.all(
  //         tab.exploreNames.map(async (exploreName, index) => {
  //           try {
  //             const { filters, measures, dimensions } =
  //               await getExploreFields(tab.exploreModel, exploreName)
  //             newTab.explores[index] = {
  //               filters,
  //               measures,
  //               dimensions,
  //               name: exploreName,
  //               model: tab.exploreModel,
  //               rank_explore: tab.rank_explore,
  //             }
  //           } catch (e) {
  //             console.error('Error querying for tab explores: ', e)
  //           }
  //         })
  //       )
  //       tabsList[tabIndex] = newTab;
  //       counter += 1;
  //       if (counter === configurationData.tabs.length) {
  //         setTabs(tabsList)
  //         setIsLoadingTabs(false)
  //       }
  //       else {
  //         setError({
  //           message:
  //             'Please ensure all tabs are defined correctly in the app configuration.',
  //         })
  //         setIsLoadingTabs(false)
  //       }
  //     })
  //   )
  // }

  initTabs()
}, [])



//   const [dashboardData, setDashboardData] = useState([]);
//   useEffect( async () => {
//   let response = await  sdk.ok(sdk.dashboard("789")).then((res) => {
//       Promise.all(
//         res.dashboard_elements.map(
//           (element) =>
//             new Promise((resolve, reject) => {
//               sdk
//                 .ok(sdk.run_query({ query_id: element.query.id, result_format: "json" }))
//                 .then((res) => {
//                   console.log("query-data", element.title, res, Object.values(res)[0]);
//
//                 })
//                 .catch((err) => {
//                   console.log("err", err);
//                   reject();
//                 });
//             })
//         )
//       ).then((values) => {
//         setDashboardData(values);
//       });
//     });
//   }, []);
//


  // const [queryId, updateQueryId] = useState();
  //
  //
  // useEffect( async () => {
  //
  // sdk.ok(sdk.run_query({query_id: '20388', result_format: 'json'})).then((res) => {
  //
  //
  //     console.log("this is data", res);
  //
  //
  //     console.log(res[0])
  //
  //   });
  //
  //
  //
  //
  // }, []);


// const [queryDash, setQueryId] = useState();
// useEffect( () => {
//
//  sdk.ok(sdk.dashboard('789')).then((res) => {
//     console.log(res);
//
//
//   setQueryId(res.dashboard_elements[0].title);
//
//
//     for (let result in res.dashboard_elements) {
//       let query = res.dashboard_elements[result].query.id;
//
//       let title = res.dashboard_elements[result].title;
//
//       console.log('Title ', title);
//       console.log('query ', query);
//
//
//
//     }
//   });
// }, []);





  return (



      <div style={{height:"20px"}}>

            <p>hello</p>

      </div>


  );
};

export default Api;
