import { Link } from "react-router-dom";

const ChoicePage = () => {
  const pilihpenyakit = [
    {
      id: 1,
      penyakit: "Jantung",
      deskripsi: "Cek Analisis Resiko Penyakit Jantung Anda",
    },
    {
      id: 2,
      penyakit: "Diabetes",
      deskripsi: "Cek Analisis Resiko Penyakit Diabetes Anda",
    },
    {
      id: 3,
      penyakit: "Kolestrol",
      deskripsi: "Cek Analisis Resiko Penyakit Kolesterol Anda",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center px-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg px-12 py-16">
        <h1 className="text-3xl font-bold text-[#0B4C00] text-center mb-16">
          Pilih Penyakit yang Ingin Dicek
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {pilihpenyakit.map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-6">
              <div className="w-full border-2 border-[#A3C9A8] rounded-2xl p-8 text-center bg-white">
                <h2 className="text-lg font-extrabold tracking-wide">
                  {item.penyakit.toUpperCase()}
                </h2>
                <p className="text-sm text-gray-600 mt-2">{item.deskripsi}</p>
              </div>

              {/* Button */}
              <Link
                to={`/choice?penyakit=${item.penyakit.toLowerCase()}`}
                className="bg-[#2D6A4F] text-white px-19 py-3 rounded-full font-medium"
              >
                Cek
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChoicePage;
