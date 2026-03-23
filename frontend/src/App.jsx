import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import LoginPage from "./components/LoginPage";
import LandingPage from "./components/LandingPage";

function App() {
  return (
    <GoogleOAuthProvider clientId="https://660074337831-gqktjeukc1umn70bgnm1s11ga41u5g3n.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;