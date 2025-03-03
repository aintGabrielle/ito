import { createBrowserRouter } from "react-router-dom";
import Signin from "./Components/Signin";
import Signup from "./Components/Signup";
import Dashboard from "./Components/Dashboard";
import App from "./App";
import PrivateRoute from "./Components/PrivateRoute";
import AboutSelf from "./Components/AboutSelf";
import Challenge from "./challenge";
import Activity from "./Components/Activity";
import ProfilePage from "./Components/Profile";
import StartedWorkout from "./Components/StartedWorkout";
import ChatBot from "./Components/ChatBot";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/signin", element: <Signin /> },
  { path: "/signup", element: <Signup /> },
  {
    path: "/chatbot",
    element: (
      <PrivateRoute>
        <ChatBot />
      </PrivateRoute>
    ),
  },
  {
    path: "/started-workout",
    element: (
      <PrivateRoute>
        <StartedWorkout />
      </PrivateRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <PrivateRoute>
        <ProfilePage />
      </PrivateRoute>
    ),
  },
  {
    path: "/activity",
    element: (
      <PrivateRoute>
        <Activity />
      </PrivateRoute>
    ),
  },
  {
    path: "/challenge",
    element: (
      <PrivateRoute>
        <Challenge />
      </PrivateRoute>
    ),
  },
  {
    path: "/aboutself",
    element: (
      <PrivateRoute>
        <AboutSelf />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
]);
