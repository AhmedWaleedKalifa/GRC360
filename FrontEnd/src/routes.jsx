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
import EditIncident from "./pages/EditIncident";
import ViewFrameworks from "./pages/ViewFrameworks";
import EditRisk from "./pages/EditRisk";
import AddRisk from "./pages/AddRisk";
import AddGovernance from "./pages/AddGovernance";
import EditGovernance from "./pages/EditGovernance";
import Requirements from "./pages/Requirements";
import Controls from "./pages/Controls";
import EditControl from "./pages/EditControl";
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
      { path: "compliance/:id?", element: <Compliance /> },
      { path: "requirements/:id?", element: <Requirements /> },
      { path: "controls/:id?", element: <Controls /> },
      { path: "editControl/:id?", element: <EditControl /> },

      
      { path: "configurations", element: <Configurations /> },
      { path: "governance/:id?", element: <Governance /> },
      { path: "incidents/:id?", element: <Incidents /> },
      { path: "logs/:id?", element: <Logs /> },
      { path: "risks/:id?", element: <Risks  /> },
      { path: "editConfigurations/:id?", element: <EditConfigurations  /> },
      {path:"viewFrameWorks/:id?",element:<ViewFrameworks/>},
      {path:"editIncident/:id?",element:<EditIncident/>},
      {path:"editRisk/:id?",element:<EditRisk/>},
      {path:"addRisk",element:<AddRisk/>},
      {path:"addGovernance",element:<AddGovernance/>},
      {path:"editGovernance/:id?",element:<EditGovernance/>},

      {path:"addIncident",element:<AddIncident/>},
      { path: "threats/:id?", element: <Threats /> },
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
