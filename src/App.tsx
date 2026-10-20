import "./App.css";
import Login from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout/Layout";
import NotFound from "./Pages/NotFound/NotFound";
import Register from "./Pages/Register/Register";
import toast, { Toaster } from "react-hot-toast";
import AuthContextProvider from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRout/ProtectedRoute";
import { ProtectedLogin } from "./components/ProtectedRout/ProtectedLogin";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import PostDetails from "./Pages/PostDetails/PostDetails";
import { useNetworkState } from "react-use";
import { useEffect } from "react";

const query = new QueryClient();
const routers = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile/",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "postDetails/:_id",
        element: (
          <ProtectedRoute>
            <PostDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "Register",
        element: (
          <ProtectedLogin>
            <Register />
          </ProtectedLogin>
        ),
      },
      {
        path: "login",
        element: (
          <ProtectedLogin>
            <Login />
          </ProtectedLogin>
        ),
      },

      { path: "*", element: <NotFound /> },
    ],
  },
]);
function App() {
  const { online } = useNetworkState();

  useEffect(() => {
    if (online === false) {
      toast.error("لا يوجد اتصال بالإنترنت", {
        id: "network-status",
        duration: Infinity,
      });
    } else {
      toast.dismiss("network-status");
    }
  }, [online]);
  return (
    <>
      <QueryClientProvider client={query}>
        <AuthContextProvider>
          <Toaster position="top-center" />
          <RouterProvider router={routers}></RouterProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
