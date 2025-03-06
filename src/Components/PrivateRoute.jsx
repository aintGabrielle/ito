import { Navigate } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  if (user === undefined) {
    return <p>Loading...</p>; // Prevents flickering
  }

  return user ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
