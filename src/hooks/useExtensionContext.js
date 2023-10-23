import { useContext, useEffect, useState } from "react";
import { ExtensionContext } from "@looker/extension-sdk-react";

export const useExtensionContext = () => {
  const { extensionSDK } = useContext(ExtensionContext);



  const [isLoadingContextData, setIsLoadingContextData] = useState(true);
  const [appConfig, setAppConfig] = useState();
  const getContextData = async () => {


    setIsLoadingContextData(true);
    try {

      const contextData = await extensionSDK.getContextData();

      setAppConfig({


        showDashboardFilters: true,
        tabs: [],
        baseUrl: `${extensionSDK.lookerHostData.hostUrl}`,

        otherUrl: `${extensionSDK.lookerHostData.hostUrl}/${extensionSDK.lookerHostData.hostType}`,
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
  }, []);



  return {

    isLoadingContextData,
    appConfig,
  };
};
