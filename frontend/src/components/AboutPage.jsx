import { useState } from "react";
import icon from "../assets/icon.svg";
import Profile from "../assets/profile.png";
import { Link } from "react-router-dom";

export default function NavbarPage() {
  const [active, setActive] = useState("deskripsi");

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <nav className="bg-white shadow-md px-10 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <img src={icon} alt="logo" className="h-10" />
          </div>

          <div className="hidden md:flex items-center justify-center gap-11 font-semibold text-gray-700 flex-1 relative">
            <a
              href="#deskripsi"
              onClick={() => setActive("deskripsi")}
              className={`relative pb-1 transition ${
                active === "deskripsi"
                  ? "text-black"
                  : "text-gray-700 hover:text-black"
              }`}
            >
              Deskripsi
              {active === "deskripsi" && (
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-pine-green rounded-full"></span>
              )}
            </a>

            <a
              href="#cara-kerja"
              onClick={() => setActive("cara-kerja")}
              className={`relative pb-1 transition ${
                active === "cara-kerja"
                  ? "text-black"
                  : "text-gray-700 hover:text-black"
              }`}
            >
              Cara Kerja
              {active === "cara-kerja" && (
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-pine-green rounded-full"></span>
              )}
            </a>

            <a
              href="#sumber-data"
              onClick={() => setActive("sumber-data")}
              className={`relative pb-1 transition ${
                active === "sumber-data"
                  ? "text-black"
                  : "text-gray-700 hover:text-black"
              }`}
            >
              Sumber Data
              {active === "sumber-data" && (
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-pine-green rounded-full"></span>
              )}
            </a>
          </div>

          <div className="hidden md:flex items-center">
            <Link
              to="/profile"
              onClick={() => setActive("profile")}
              className={`relative pb-1 transition ${
                active === "profile"
                  ? "text-black"
                  : "text-gray-700 hover:text-black"
              }`}
            >
              <img
                src={Profile}
                alt="Profile"
                className="h-12 w-12 rounded-full"
              />
            </Link>
          </div>
        </div>
      </nav>

      {/* FLOATING BUTTON */}
      <div className="fixed bottom-0 left-0 w-full flex justify-center py-4 bg-white/80 backdrop-blur-md z-50">
        <Link
          to="/choice"
          className="bg-pine-green text-white px-19 py-3 rounded-full font-medium shadow-lg hover:scale-105 transition"
        >
          Mulai Cek Sekarang
        </Link>
      </div>
    </div>
  );
}
