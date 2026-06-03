import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./components/modals/RootLayout";
import Home from "./pages/Home";
import Games from "./pages/Games";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import About from "./pages/About";
import Settings from "./pages/Settings";

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
                path: "games",
                element: <Games />,
            },
            {
                path: "friends",
                element: <Friends />,
            },
            {
                path: "about",
                element: <About />,
            },
            {
                path: "profile",
                element: <Profile />,
            },
            {
                path: "settings",
                element: <Settings />,
            },
        ],
    },
]);
