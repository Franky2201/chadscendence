import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import TestApp from './TestApp';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/test',
        element: <TestApp />,
    }
]);
