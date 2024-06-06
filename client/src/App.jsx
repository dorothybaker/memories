import Footer from "./components/Footer";
import Topbar from "./components/Topbar";
import Home from "./pages/Home";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { useQuery } from "@tanstack/react-query";
import { API } from "./utils/makeRequest";
import Create from "./pages/Create";
import Post from "./pages/Post";

function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <Topbar />

      <div className="flex-1">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}

function App() {
  const { data: user } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await API.get("/auth/me");

        if (res.status === 200) {
          const data = res.data;

          return data;
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/memory/:id", element: <Post /> },
        {
          path: "/create",
          element: user ? <Create /> : <Navigate to="/signin" />,
        },
        { path: "/signin", element: user ? <Navigate to="/" /> : <Signin /> },
        { path: "/signup", element: user ? <Navigate to="/" /> : <Signup /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
