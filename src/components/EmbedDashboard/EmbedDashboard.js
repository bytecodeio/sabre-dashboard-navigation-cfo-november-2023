import React, { useCallback, useContext } from "react";
import { EmbedContainer } from "./EmbedContainer/EmbedContainer";
import { LookerEmbedSDK } from "@looker/embed-sdk";
import { ExtensionContext } from "@looker/extension-sdk-react";

export const EmbedDashboard = ({
  dashboardId,
  showDashboardFilters,
  fieldNameSuggestions,
  setSelectedCheckboxes,
  selectedCheckboxes,
}) => {
  const { extensionSDK } = useContext(ExtensionContext);
//   const [dashboard, setDashboard] = useState()
//
//
//   useEffect(() => {
//   if (dashboard) {
//
//     dashboard.send("dashboard:filters:update", {
//     Brand_Name: [setSelectedCheckboxes],
//     });
//     dashboard.send("dashboard:run");
//   }
// }, [selectedFilters]);
//
// // Set the state of the dashboard so we can update filters and run
//   const handleFilterChanged= (dashboard) => {
//     setDashboard(dashboard);
//
//   };


  const embedDashboard = useCallback(
    (embedContainer) => {
      const hostUrl = extensionSDK.lookerHostData?.hostUrl;
      if (embedContainer && dashboardId && hostUrl) {
        embedContainer.innerHTML = "";
        const embedUrl = `${hostUrl}/embed/dashboards/${dashboardId}?_theme={"show_filters_bar":${showDashboardFilters}, "show_title":false}&embed_domain=${hostUrl}&sdk=2&sandboxed_host=true`;

        console.log(hostUrl);
        LookerEmbedSDK.init(hostUrl);
        LookerEmbedSDK.createDashboardWithUrl(embedUrl)
          .appendTo(embedContainer)
          // .on('dashboard:filters:changed', handleFilterChanged)
          .build()
          .connect()
          .then()
          // .then((dash) => setDashboard(dash))
          .catch((e) => console.error(e));
      }
    },
    [dashboardId, showDashboardFilters]
  );

  return (
    <EmbedContainer
    ref={embedDashboard}
    fieldNameSuggestions={fieldNameSuggestions}
    setSelectedCheckboxes={setSelectedCheckboxes}
    selectedCheckboxes={selectedCheckboxes}
    />
  );
};
