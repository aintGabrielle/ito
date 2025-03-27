import { createBrowserRouter } from "react-router-dom";
import Signin from "./Components/Signin";
import Signup from "./Components/Signup";
import Dashboard from "./Components/Dashboard";
import App from "./App";
import PrivateRoute from "./Components/PrivateRoute";
import AboutSelf from "./Components/AboutSelf";
import Activity from "./Components/Activity";
import ProfilePage from "./Components/Profile";
import StartedWorkout from "./Components/StartedWorkout";
import ChatBot from "./Components/ChatBot";
import TimeBasedChallenge from "./Components/Challenge";
import FitnessAssessment from "./Components/Assessment";
import Task from "./Components/Task";
import Profile from "./Components/Profile";
import AuthRedirect from "./Components/AuthRedirect";
import Forum from "./Components/Forum";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/signin", element: <Signin /> },
  { path: "/signup", element: <Signup /> },
  { path: "/forum", element: <PrivateRoute><Forum /></PrivateRoute> },
  {
    path: "/profile",
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    ),
  },
  {
    path: "/challenges",
    element: (
      <PrivateRoute>
        <Task />
      </PrivateRoute>
    ),
  },
  {
    path: "/assessment",
    element: (
      <PrivateRoute>
        <FitnessAssessment />
      </PrivateRoute>
    ),
  },
  {
    path: "/challenge",
    element: (
      <PrivateRoute>
        <TimeBasedChallenge />
      </PrivateRoute>
    ),
  },
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
  {
    path: "/auth-redirect",
    element: <AuthRedirect />,
  },
]);
