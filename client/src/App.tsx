import { Route, Routes } from "react-router";
import About from "./Pages/About";
import Landing from "./Pages/Landing";
import Signup from "./Pages/Auth/Signup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/auth/signup" element={<Signup />} />
    </Routes>
  );
}
export default App;
