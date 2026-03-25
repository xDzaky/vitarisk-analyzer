import icon from "../assets/icon.svg";
import bg from "../assets/background.svg";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* overlay putih langsung di atas background */}
      <div
        className="absolute inset-0 "
        style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
      />

      {/* konten */}
      <div className="relative z-10">
        <nav>
          <img src={icon} className="h-20 p-5" alt="" />
        </nav>

        <section className="flex flex-col justify-center gap-20 min-h-[calc(80vh-80px)] items-center">
          <h1 className="font-bold text-4xl text-center tracking-wide">
            Kenali Risiko{" "}
            <span className="text-pure-green">Sebelum Terlambat</span>
          </h1>
          <p className="text-pine-green tracking- font-medium text-xl text-center">
            Pemeriksaan cepat ini dirancang untuk membantu kamu memahami
            <br />
            risiko kesehatan berdasarkan kondisi dan kebiasaanmu.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-80 rounded-4xl py-2 px-6 bg-pine-green font-medium text-xl text-white hover:bg-dark-green-teal transition"
          >
            Mulai Tes
          </button>
        </section>
      </div>
    </div>
  );
}
