import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import FooterInfoPage from "./features/interview/pages/FooterInfoPage";


export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/about",
        element: <FooterInfoPage page="about" />
    },
    {
        path: "/help",
        element: <FooterInfoPage page="help" />
    },
    {
        path: "/privacy-policy",
        element: <FooterInfoPage page="privacy" />
    },
    {
        path: "/terms",
        element: <FooterInfoPage page="terms" />
    },
    {
        path: "/",
        element: <Protected><Home /></Protected>
    },
    {
        path:"/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    }
])
