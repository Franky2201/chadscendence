import { createBrowserRouter } from "react-router-dom";
import RootWrapper from "./components/RootWrapper";
import Home from "./pages/Home";
import Games from "./pages/Games";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import About from "./pages/About";
import Users from "./pages/Users";
import Room from "./pages/Room";
import Admin from "./pages/Admin";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

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
                path: "privacypolicy",
                element: <PrivacyPolicy />,
            },
            {
                path: "termsofservice",
                element: <TermsOfService />,
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
                path: "users/:username",
                element: <PublicProfile />,
            },
            {
                path: "room",
                element: <Room />,
            },
            {
                path: "room/:code",
                element: <Room />,
            },
            {
                path: "admin",
                element: <Admin />,
            },
        ],
    },
]);
