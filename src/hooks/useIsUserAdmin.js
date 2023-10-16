import { useState, useEffect } from "react";

export const useIsUserAdmin = (sdk, setAppError) => {
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

  return {
    isCheckingAdminUser,
    isAdminUser,
  };
};
