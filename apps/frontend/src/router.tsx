import { createBrowserRouter } from "react-router-dom";
import RootWrapper from "./components/RootWrapper";
import Home from "./pages/Home";
import Games from "./pages/Games";
import Profile from "./pages/Profile";
import Art from "./pages/Art";
import Friends from "./pages/Friends";
import About from "./pages/About";

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
                path: "friends",
                element: <Friends />,
            },
            {
                path: "art",
                element: <Art />,
            },
            {
                path: "about",
                element: <About />,
            },
            {
                path: "profile",
                element: <Profile />,
            },
        ],
    },
]);
