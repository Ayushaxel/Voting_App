import { createBrowserRouter, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Candidates from "./pages/Candidates";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import ChangePassword from "./pages/ChangePassword";
import VoteCounts from "./pages/voteCount";

const Layout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);
 
const router = createBrowserRouter([
  {
    element: <Layout />,
     errorElement: <Error />, 
    children: [
      { path: "/", element: <Home /> },
      { path: "/candidates", element: <Candidates /> },
      { path: "/signup", element: <Signup /> },
      { path: "/login", element: <Login /> },
      { path: "/vote-counts", element: <VoteCounts/> },
      { path: "/admin", element: (<ProtectedRoute> <AdminDashboard /></ProtectedRoute>) },
      { path: "/profile", element: (<ProtectedRoute><Profile /></ProtectedRoute>) },
      { path: "/change-password", element: (<ProtectedRoute><ChangePassword/></ProtectedRoute>) },

    ],
  },
]);

export default router;
