import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

import {
  useAuth
} from "./context/AuthContext";

function App() {

  const { user } = useAuth();

  return (

    <Routes>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/"
        element={
          user
            ? <Dashboard />
            : <Navigate to="/login" />
        }
      />

    </Routes>
  );
}

export default App;