import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from '@/layout'
import 'styles/global.scss'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import BookPage from 'pages/client/book';
import AboutPage from 'pages/client/about';
import Login from 'pages/client/auth/login';
import Register from 'pages/client/auth/register';
import HomePage from 'pages/client/home';
import { App } from 'antd';
import { AppProvider } from 'components/context/app.context';
import ProtectedRouter from './components/auth';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "/book",
        element: <BookPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/checkout",
        element: (
          <ProtectedRouter>
            <div>checkout page</div>
          </ProtectedRouter>
        ),
      },
      {
        path: "/admin",
        element: (
          <ProtectedRouter>
            <div>admin page</div>
          </ProtectedRouter>
        ),
      },
    ]
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <Layout /> */}
    <App>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </App>
  </StrictMode>,
)
