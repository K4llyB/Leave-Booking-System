import ManageRequests from "./pages/ManageRequests";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import RequestsList from "./pages/RequestsList";
import RequestForm from "./pages/RequestForm";
import NotFound from "./pages/NotFound";
import Protected from "./Protected";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "login", element: <Login /> },
      {
        element: <Protected />,
        children: [
          { path: "requests", element: <RequestsList /> },
          { path: "requests/new", element: <RequestForm /> },
        ],
      },
      { path: "*", element: <NotFound /> },

      {
  element: <Protected roles={["manager","admin"]} />,
  children: [{ path: "manage", element: <ManageRequests /> }],
},
    ],
  },
]);

