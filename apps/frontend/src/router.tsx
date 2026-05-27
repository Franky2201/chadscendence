import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './components/modals/RootLayout';
import Home from './pages/Home';
import Profile from './pages/Profile'
import Art from './pages/Art';
import Friends from './pages/Friends';
import About from './pages/About';

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
        path: 'friends',
        element: <Friends />,
      },
      {
        path: 'art',
        element: <Art />,
      },
      {
        path: 'about',
        element: <About />,
      },
	  {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
]);
