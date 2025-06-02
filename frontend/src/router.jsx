import { createBrowserRouter } from "react-router-dom";
//#region
// Home
import Home from "./pages/Home/Home";
// Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
// Admin
import Layout from "./components/Layout/Layout";
// Clients
import Clients from "./pages/Clients/Clients";
import ClientsItems from "./pages/Clients/ClientsItems";
// Others
import NotFound from "./pages/NotFound";
import Panel from "./pages/Admin/Panel";
//#endregion
export const router = createBrowserRouter([
    // Home
    { path: '/', element: <Home /> },
    // Auth
    { path: '/auth/login', element: <Login /> },
    { path: '/auth/register', element: <Register /> },
    // Admin
    { path: '/admin/dashboard', element: <Layout> <Panel /> </Layout> },
    // Clients
    { path: '/admin/clients', element: <Layout> <Clients /> </Layout> },
    { path: '/admin/clients/:id', element: <Layout> <ClientsItems />  </Layout> },

    // Others
    { path: '*', element: <NotFound /> },
])