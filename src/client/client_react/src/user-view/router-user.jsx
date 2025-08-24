import { useRoutes, Navigate } from "react-router-dom";

import Page from "./pages/page";

const UserRouter = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <Page />,
    },

    {
      path: "*",
      element: <Navigate to="/login" replace />,
    },
  ]);

  return element;
};

export default UserRouter;
