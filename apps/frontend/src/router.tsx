import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './components/modals/RootLayout';
import Home from './pages/Home';
import Art from './pages/Art';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'art',
        element: <Art />,
      },
    ],
  },
]);
