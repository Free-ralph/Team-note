import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import  {StateContextProvider}  from "./context/StateContextProvider";
import { QueryClient, QueryClientProvider } from "react-query";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
      staleTime: 5 * 1000,
    },
  },
});



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    
    <QueryClientProvider client={queryClient}>
    <StateContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </StateContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
