import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Login from './pages/Login.tsx';
import Root from './pages/Root.tsx';
import CaseReport from './pages/nurse/CaseReport.tsx';
import Inventory from './pages/nurse/Inventory.tsx';
import MedicalHistory from './pages/nurse/MedicalHistory.tsx';
import Transactions from './pages/nurse/Transactions.tsx';
import MedCert from './pages/nurse/transactions/MedCert.tsx';
import MedicalReport from './pages/nurse/transactions/MedicalReport.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'transactions',
        element: <Transactions />,
        children: [
          {
            path: 'medical-report',
            element: <MedicalReport />,
          },

          {
            path: 'med-cert',
            element: <MedCert />,
          },
        ],
      },

      {
        path: 'medical-history',
        element: <MedicalHistory />,
      },
      {
        path: 'case-report',
        element: <CaseReport />,
      },
      {
        path: 'inventory',
        element: <Inventory />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
