// routes.js
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
import Register from "./pages/Register"; // Add this import
import EditConfigurations from "./pages/EditConfigurations";
import AddIncident from "./pages/AddIncident";
import EditIncident from "./pages/EditIncident";
import EditRisk from "./pages/EditRisk";
import AddRisk from "./pages/AddRisk";
import AddGovernance from "./pages/AddGovernance";
import EditGovernance from "./pages/EditGovernance";
import Requirements from "./pages/Requirements";
import Controls from "./pages/Controls";
import EditControl from "./pages/EditControl";
import Awareness from "./pages/Awareness";
import TrainingModule from "./pages/TrainingModule";

const routes = [
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/register", // Add register route
    element: <Register />,
    errorElement: <ErrorPage />,
  },
  {
    path: "app",
    element: <Dashboard />,
    children: [
      { path: "dashboard", element: <Main /> },

      { path: "awareness/:id?", element: <Awareness /> },
      { path: "training/:id", element: <TrainingModule /> },

      { path: "governance/:id?", element: <Governance /> },
      { path: "addGovernance", element: <AddGovernance /> },
      { path: "editGovernance/:id?", element: <EditGovernance /> },

      { path: "risks/:id?", element: <Risks /> },
      { path: "addRisk", element: <AddRisk /> },
      { path: "editRisk/:id?", element: <EditRisk /> },

      { path: "compliance/:id?", element: <Compliance /> },
      { path: "requirements/:id?", element: <Requirements /> },
      { path: "controls/:id?", element: <Controls /> },
      { path: "editControl/:id?", element: <EditControl /> },

      { path: "incidents/:id?", element: <Incidents /> },
      { path: "addIncident", element: <AddIncident /> },
      { path: "editIncident/:id?", element: <EditIncident /> },

      { path: "threats/:id?", element: <Threats /> },

      { path: "logs/:id?", element: <Logs /> },

      { path: "configurations/:id?", element: <Configurations /> },
      { path: "editConfigurations/:id?", element: <EditConfigurations /> },

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