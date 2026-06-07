import { createBrowserRouter } from "react-router-dom";
import RootWrapper from "./components/RootWrapper";
import Home from "./pages/Home";
import Games from "./pages/Games";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Users from "./pages/Users";
import Room from "./pages/Room";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootWrapper />,
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
                path: "about",
                element: <About />,
            },
            {
                path: "profile",
                element: <Profile />,
            },
            {
                path: "users",
                element: <Users />,
            },
            {
                path: "room",
                element: <Room />,
            },
            {
                path: "room/:code",
                element: <Room />,
            },
        ],
    },
]);
