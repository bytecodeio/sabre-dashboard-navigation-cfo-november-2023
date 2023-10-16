import React, { useCallback, useContext } from "react";
import { EmbedContainer } from "./EmbedContainer/EmbedContainer";
import { LookerEmbedSDK } from "@looker/embed-sdk";
import { ExtensionContext } from "@looker/extension-sdk-react";

export const EmbedDashboard = ({ dashboardId, showDashboardFilters }) => {
  const { extensionSDK } = useContext(ExtensionContext);

  const embedDashboard = useCallback(
    (embedContainer) => {
      const hostUrl = extensionSDK.lookerHostData?.hostUrl;
      if (embedContainer && dashboardId && hostUrl) {
        embedContainer.innerHTML = "";
        const embedUrl = `${hostUrl}/embed/dashboards/${dashboardId}?_theme={"show_filters_bar":${showDashboardFilters}}&embed_domain=${hostUrl}&sdk=2&sandboxed_host=true`;

          console.log(hostUrl)
        LookerEmbedSDK.init(hostUrl);
        LookerEmbedSDK.createDashboardWithUrl(embedUrl)
          .appendTo(embedContainer)
          .build()
          .connect()
          .then(() => {})
          .catch((e) => console.error(e));
      }
    },
    [dashboardId, showDashboardFilters]
  );

  return <EmbedContainer ref={embedDashboard} />;
};
