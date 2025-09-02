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
import PageTemplate from "./pages/PageTemplate";
import Login from "./pages/Login";
import EditConfigurations from "./pages/EditConfigurations";
import AddIncident from "./pages/AddIncident";
const routes = [
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorPage />,

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
      { path: "risks/:id?", element: <Risks  /> },
      { path: "editConfigurations/:id?", element: <EditConfigurations  /> },
      {path:"addIncident",element:<AddIncident/>},
      { path: "threats", element: <Threats /> },
      { path: "*", element: <ErrorPage /> }
    ],
  },

  {
    path: "pages",
    element: <PageTemplate />,
    children: [
      { path: "notifications", element: <Notifications /> },
      { path: "profile", element: <Profile /> },
      { path: "*", element: <ErrorPage /> },
    ],
  },
  
];

export default routes;
