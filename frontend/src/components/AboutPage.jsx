import { useState } from "react";
import icon from "../assets/icon.svg";
import Profile from "../assets/Profile.png";
import { Link, useNavigate } from "react-router-dom";
import { getStoredToken } from "../lib/api";

export default function AboutPage() {
  const [active, setActive] = useState("deskripsi");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <nav className="bg-white shadow-md px-10 py-4 sticky top-0 z-20">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <img
              src={icon}
              alt="logo"
              className="h-10 cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>

          <div className="hidden md:flex items-center justify-center gap-11 font-semibold text-gray-700 flex-1 relative">
            {[
              ["deskripsi", "Deskripsi"],
              ["cara-kerja", "Cara Kerja"],
              ["sumber-data", "Sumber Data"],
            ].map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setActive(id)}
                className={`relative pb-1 transition ${
                  active === id ? "text-black" : "text-gray-700 hover:text-black"
                }`}
              >
                {label}
                {active === id ? (
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-pine-green rounded-full"></span>
                ) : null}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <Link to={getStoredToken() ? "/profile" : "/login"}>
              <img src={Profile} alt="Profile" className="h-12 w-12 rounded-full" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto w-full px-6 py-16 pb-32 space-y-16">
        <section id="deskripsi" className="space-y-4">
          <p className="text-sm font-semibold tracking-[0.2em] text-[#327E66]">
            TENTANG VITARISK
          </p>
          <h1 className="text-4xl font-bold text-gray-900">
            Platform edukasi dan deteksi risiko kesehatan yang lebih mudah dipahami.
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Vitarisk membantu pengguna memahami risiko jantung, diabetes, dan
            kolesterol melalui form deteksi, hasil prediksi yang mudah dibaca,
            rekomendasi pencegahan, dan chatbot edukatif.
          </p>
        </section>

        <section id="cara-kerja" className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Isi data kesehatan",
              desc: "User memilih penyakit yang ingin dicek lalu mengisi data gaya hidup dan indikator klinis yang diminta.",
            },
            {
              title: "Model memproses prediksi",
              desc: "Backend mengirim data ke service ML untuk menghitung tingkat risiko dan faktor utama yang paling berpengaruh.",
            },
            {
              title: "Hasil dan tindak lanjut",
              desc: "User melihat tingkat risiko, saran pencegahan, chatbot edukatif, dan rumah sakit terdekat.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-gray-200 bg-gray-50 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
              <p className="mt-3 text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        <section
          id="sumber-data"
          className="rounded-3xl border border-[#327E66]/20 bg-[#327E66]/5 p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900">Sumber data dan batasan</h2>
          <p className="mt-4 text-gray-700 leading-relaxed">
            Model machine learning di Vitarisk dibangun dari dataset kesehatan
            yang relevan untuk klasifikasi risiko. Hasil ini bersifat edukatif
            dan tidak menggantikan diagnosis dokter. Karena itu, halaman hasil
            selalu menampilkan disclaimer dan saran tindak lanjut yang aman.
          </p>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 w-full flex justify-center py-4 bg-white/80 backdrop-blur-md z-50">
        <Link
          to="/"
          className="bg-pine-green text-white px-19 py-3 rounded-full font-medium shadow-lg hover:scale-105 transition"
        >
          Mulai Cek Sekarang
        </Link>
      </div>
    </div>
  );
}
