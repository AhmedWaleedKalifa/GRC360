import App from "./App";
import ErrorPage from "./pages/ErrorPage";
import Dashboard from "./pages/Dashboard";
import Main from "./pages/Main";
import Compliance from "./pages/Compliance";
import Configurations from "./pages/Configurations";
import Governance from "./pages/Governance";
import Incidents from "./pages/Incidents";
import Logs from "./pages/Logs";
import Profile from "./pages/Profile"
import Risks from "./pages/Risks";
import Threats from "./pages/Threats";
import Notifications from "./pages/Notifications";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,

  },
  {
    path: "/notifications",
    element: <Notifications />,
  },
  {
    path: "/profile",
    element: <Profile />,

  },
  {
    path: "dashboard",
    element: <Dashboard />,
    children: [
      { index: true, element: <Main /> },
      { path: "compliance", element: <Compliance /> },
      { path: "configurations", element: <Configurations /> },
      { path: "governance", element: <Governance /> },
      { path: "incidents", element: <Incidents /> },
      { path: "logs", element: <Logs /> },
      { path: "risks", element: <Risks /> },
      { path: "threats", element: <Threats /> },
      { path: "*", element: <ErrorPage /> }
    ],
  },
];

export default routes;
