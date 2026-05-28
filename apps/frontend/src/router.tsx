import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./components/modals/RootLayout";
import Home from "./pages/Home";
import TestApp from "./pages/TestApp";
import Games from "./pages/Games";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: "test",
                element: <TestApp />,
            },
            {
                path: "games",
                element: <Games />,
            },
        ],
    },
]);
