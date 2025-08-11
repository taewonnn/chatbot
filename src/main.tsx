import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { router } from './router/router';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {process.env.NODE_ENV === 'production' && <SpeedInsights />}
    </QueryClientProvider>
  </React.StrictMode>,
);
