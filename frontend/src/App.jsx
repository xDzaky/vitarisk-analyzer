import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import LoginPage from "./components/LoginPage";
import LandingPage from "./components/LandingPage";
import ProfilePage from "./components/ProfilePage";
import HistoryCek from "./components/HistoryCek";

import JantungPage from "./components/JantungPage";
import DiabetesPage from "./components/DiabetesPage";
import KolestrolPage from "./components/KolestrolPage";
import PageResult from "./components/PageResult";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/history" element={<HistoryCek />} />
          <Route path="/landing/deteksi-jantung" element={<JantungPage />} />
          <Route path="/landing/deteksi-diabetes" element={<DiabetesPage />} />
          <Route
            path="/landing/deteksi-kolestrol"
            element={<KolestrolPage />}
          />
          <Route path="/result" element={<PageResult />} /> 
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
