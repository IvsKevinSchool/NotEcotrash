import { createBrowserRouter } from "react-router-dom";
//#region
// Home
import Home from "./pages/Home/Home";
// Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
// Admin
import Layout from "./components/Common/Layout";
// Clients
import Clients from "./pages/Clients/Clients";
import ClientsItems from "./pages/Clients/ClientsItems";
// Others
import NotFound from "./pages/NotFound";
import Panel from "./pages/Admin/Panel";
import PublicRoute from "./routes/PublicRoutes";
import PrivateRoute from "./routes/PrivateRoutes";
//#endregion
export const router = createBrowserRouter([
    // // Home
    // { path: '/', element: <Home /> },
    // // Auth
    // { path: '/auth/login', element: <Login /> },
    // { path: '/auth/register', element: <Register /> },
    // // Admin
    // { path: '/admin/dashboard', element: <Layout> <Panel /> </Layout> },
    // // Clients
    // { path: '/admin/clients', element: <Layout> <Clients /> </Layout> },
    // { path: '/admin/clients/:id', element: <Layout> <ClientsItems />  </Layout> },

    // // Others
    // { path: '*', element: <NotFound /> },

    // Rutas públicas
    { path: '/', element: <Home /> },
    { path: '/auth/login', element: <PublicRoute><Login /></PublicRoute> },
    { path: '/auth/register', element: <PublicRoute><Register /></PublicRoute> },

    // Layout protegido (todas las rutas dentro tienen la protección)
    // Rutas protegidas bajo /admin
    {
        path: '/admin',
        element: <PrivateRoute />, // Solo verifica autenticación
        children: [
            {
                element: <Layout />, // Aplica el layout a todas las rutas hijas
                children: [
                    { path: 'dashboard', element: <Panel /> },
                    { path: 'clients', element: <Clients /> },
                    { path: 'clients/:id', element: <ClientsItems /> },
                ]
            }
        ]
    },

    // 404
    { path: '*', element: <NotFound /> },
])