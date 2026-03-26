import icon from "../assets/icon.svg";
import React from "react";

const HistoryPage = () => {
  const histories = [
    { id: 1, penyakit: "Jantung", tanggal: "15 Februari 2026" },
    { id: 2, penyakit: "Jantung", tanggal: "14 Februari 2026" },
    { id: 3, penyakit: "Jantung", tanggal: "13 Februari 2026" },
    { id: 4, penyakit: "Jantung", tanggal: "12 Februari 2026" },
    { id: 5, penyakit: "Jantung", tanggal: "11 Februari 2026" },
    { id: 6, penyakit: "Jantung", tanggal: "10 Februari 2026" },
  ];

  return (
    <div className="bg-bg min-h-screen">
      <nav className="p-5">
        <img src={icon} className="h-10" alt="logo" />
      </nav>

      <div className="bg-white rounded-2xl shadow-md p-10 max-w-4xl w-full mx-auto mt-10 mb-10">
        <h2 className="font-semibold mb-9 text-lg">Riwayat cek</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {histories.map((item) => (
            <div
              key={item.id}
              className="border border-[#0B4C00] rounded-lg p-6 text-center cursor-pointer"
            >
              <p className="font-medium">{item.penyakit}</p>
              <p className="text-sm text-[#0B4C00]">{item.tanggal}</p>
            </div>
          ))}
        </div>

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
