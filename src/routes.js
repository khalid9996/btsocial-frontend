import { useRoutes } from "react-router-dom";
import { AuthTabs, ResetPassword, Feeds } from "./pages";

export const AppRouter = () => {
  const elements = useRoutes([
    {
      path: "/",
      element: <AuthTabs />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
    {
      path: "/media/feeds",
      element: <Feeds />,
    },
  ]);

  return elements;
};
