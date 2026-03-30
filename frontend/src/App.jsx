import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import LoginPage from "./components/LoginPage";
import LandingPage from "./components/LandingPage";
import ProfilePage from "./components/ProfilePage";
import HistoryCek from "./components/HistoryCek";
import AboutPage from "./components/AboutPage";
import ChoicePage from "./components/ChoicePage";
import JantungPage from "./components/JantungPage";
import DiabetesPage from "./components/DiabetesPage";
import KolestrolPage from "./components/KolestrolPage";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/history" element={<HistoryCek />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/choice" element={<ChoicePage />} />
          <Route path="/choice/jantung" element={<JantungPage />} />
          <Route path="/choice/diabetes" element={<DiabetesPage />} />
          <Route path="/choice/kolestrol" element={<KolestrolPage />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
