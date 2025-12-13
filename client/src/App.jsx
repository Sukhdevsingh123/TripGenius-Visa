import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  Dashboard,
  HomeLayout,
  Landing,
  Login,
  Logout,
  Register,
  FormPage,
  ItineraryPage,
  VisaPage,
} from "./pages";


import { ToastContainer, toast } from "react-toastify";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "agent-form",
        element: <FormPage />,
      },
      {
        path: "agent-itinerary",
        element: <ItineraryPage />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
      {
        path: "agent-visa",
        element: <VisaPage />,
      },
      {
        path: "visa-agent",
        element: <VisaPage />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-center" />
    </>
  );
}

export default App;
