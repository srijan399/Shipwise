import { Route, Routes } from "react-router";
import About from "./Pages/About";
import Landing from "./Pages/Landing";
import Signup from "./Pages/Auth/Signup";
import Login from "./Pages/Auth/Login";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/auth">
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
export default App;
