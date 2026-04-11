import icon from "../assets/icon.svg";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, clearStoredToken } from "../lib/api";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    const fetchHistories = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setNeedsLogin(true);
        setError("Silakan login dulu supaya riwayat cek bisa ditampilkan.");
        setLoading(false);
        return;
      }

      try {
        const result = await apiRequest("/history/predictions?limit=20");
        setHistories(result?.data?.items || []);
      } catch (err) {
        console.error(err);

        if (err.status === 401) {
          clearStoredToken();
          setNeedsLogin(true);
          setError("Session login kamu sudah habis. Silakan login ulang.");
        } else {
          setError("Riwayat cek belum bisa dimuat. Coba lagi sebentar.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistories();
  }, []);

  const formatDisease = (disease) => {
    if (disease === "heart") return "Jantung";
    if (disease === "diabetes") return "Diabetes";
    if (disease === "cholesterol") return "Kolesterol";
    return disease;
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const getRiskBadgeClass = (riskColor) => {
    if (riskColor === "red") return "bg-red-100 text-red-700";
    if (riskColor === "yellow") return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const openHistoryDetail = (item) => {
    navigate("/result", {
      state: {
        data: item.result_payload,
        type: item.disease,
        history_id: item.id,
        from_history: true,
      },
    });
  };

  return (
    <div className="bg-bg min-h-screen">
      <nav className="p-5">
        <img src={icon} className="h-10 cursor-pointer" alt="logo" onClick={() => navigate("/")} />
      </nav>

      <div className="bg-white rounded-2xl shadow-md p-10 max-w-4xl w-full mx-auto mt-10 mb-10">
        <h2 className="font-semibold mb-9 text-lg">Riwayat cek</h2>

        {loading ? (
          <div className="border border-sub-title/30 rounded-xl p-6 text-center text-sub-title">
            Memuat riwayat cek...
          </div>
        ) : null}

        {!loading && error ? (
          <div className="border border-red-200 bg-red-50 rounded-xl p-6 text-center text-red-600">
            {error}
            {needsLogin ? (
              <div className="mt-4">
                <button
                  onClick={() => navigate("/login")}
                  className="bg-[#327E66] text-white px-5 py-2 rounded-lg"
                >
                  Login Sekarang
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        {!loading && !error && histories.length === 0 ? (
          <div className="border border-sub-title/30 rounded-xl p-6 text-center text-sub-title">
            Belum ada riwayat cek yang tersimpan di akun ini.
          </div>
        ) : null}

        {!loading && !error && histories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {histories.map((item) => {
              const result = item.result_payload || {};

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openHistoryDetail(item)}
                  className="border border-sub-title/40 rounded-lg p-6 text-left hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-lg">
                        {formatDisease(item.disease)}
                      </p>
                      <p className="text-sm text-sub-title">
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskBadgeClass(
                        result.risk_color
                      )}`}
                    >
                      {result.risk_level || "Tidak diketahui"}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Risiko:</span>{" "}
                      {typeof result.risk_percent === "number"
                        ? `${result.risk_percent}%`
                        : "-"}
                    </p>
                    <p>
                      <span className="font-medium">Faktor utama:</span>{" "}
                      {Array.isArray(result.top_factors) && result.top_factors.length > 0
                        ? result.top_factors.slice(0, 2).join(", ")
                        : "Belum tersedia"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => window.history.back()}
            className="bg-[#327E66] text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
