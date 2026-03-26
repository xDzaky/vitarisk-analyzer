import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import LoginPage from "./components/LoginPage";
import LandingPage from "./components/LandingPage";
<<<<<<< HEAD
<<<<<<< HEAD

function App() {
  return (
    <GoogleOAuthProvider clientId="660074337831-gqktjeukc1umn70bgnm1s11ga41u5g3n.apps.googleusercontent.com">
=======
=======
>>>>>>> 0ce924d (Initial commit)
import ProfilePage from "./components/ProfilePage";
import HistoryCek from "./components/HistoryCek";
import AboutPage from "./components/AboutPage";
import ChoicePage from "./components/ChoicePage";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
<<<<<<< HEAD
>>>>>>> a0022af (first commit)
=======
>>>>>>> 0ce924d (Initial commit)
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 0ce924d (Initial commit)
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/history" element={<HistoryCek />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/choice" element={<ChoicePage />} />
<<<<<<< HEAD
>>>>>>> a0022af (first commit)
=======
>>>>>>> 0ce924d (Initial commit)
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

<<<<<<< HEAD
<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> a0022af (first commit)
=======
export default App;
>>>>>>> 0ce924d (Initial commit)
