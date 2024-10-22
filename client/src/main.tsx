import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Login from './pages/Login.tsx';
import RootAssistant from './pages/nurse-assistant/RootAssistant.tsx';
import TransactionsAssistant from './pages/nurse-assistant/TransactionsAssistant.tsx';
import CaseReport from './pages/nurse/CaseReport.tsx';
import Inventory from './pages/nurse/Inventory.tsx';
import MedicalHistory from './pages/nurse/MedicalHistory.tsx';
import Transactions from './pages/nurse/Transactions.tsx';
import MedCert from './pages/nurse/transactions/MedCert.tsx';
import MedicalReport from './pages/nurse/transactions/MedicalReport.tsx';
import Volunteers from './pages/nurse/Volunteers.tsx';
import Root from './pages/Root.tsx';
import DailyTimeRecord from './pages/volunteer/DailyTimeRecord.tsx';
import RootVolunteer from './pages/volunteer/RootVolunteer.tsx';
import TransactionsVol from './pages/volunteer/TransactionsVol.tsx';

const queryClient = new QueryClient();
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
      {
        path: '/volunteers',
        element: <Volunteers />,
      },
    ],
  },
  {
    path: '/assistant',
    element: <RootAssistant />,
    children: [
      {
        path: 'transactions',
        element: <TransactionsAssistant />,
        children: [
          {
            path: 'medical-report',
            element: <MedicalReport />,
          },
        ],
      },

      {
        path: 'inventory',
        element: <Inventory />,
      },
    ],
  },

  {
    path: '/volunteer',
    element: <RootVolunteer />,
    children: [
      {
        path: 'transactions',
        element: <TransactionsVol />,
        children: [
          {
            path: 'medical-report',
            element: <MedicalReport />,
          },
        ],
      },

      {
        path: 'daily-time-record',
        element: <DailyTimeRecord />,
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
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
