import icon from "../assets/icon.svg";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-bg min-h-[calc(100vh-80px)]">
      <nav className="p-5">
        <img src={icon} className="h-10 " alt="" />
      </nav>

      <section className="flex justify-center align-middle ">
        <form
          className="shadow-md w-fit p-20 gap-2 rounded-2xl flex flex-col"
          action=""
          method="get"
        >
          <h1 className="text-pure-green text-2xl text-center font-bold">
            Masuk ke Akun Anda
          </h1>

          <div className="my-5 flex justify-center">
            <GoogleLogin
              theme="outline"
              size="large"
              shape="pill"
              text="continue_with"
              onSuccess={(res) => {
                try {
                  const decoded = jwtDecode(res.credential);
                  const user = {
                    name: decoded.name,
                    email: decoded.email,
                    picture: decoded.picture,
                  };
                  navigate("/profile", { state: user });
                } catch (error) {
                  console.error("Failed to decode token", error);
                }
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>

          <span className="font-semibold">Email</span>
          <input
            type="email"
            className="border-2 border-mint-green/60 rounded-xl p-2"
            placeholder="Masukan Email"
          />

          <span className="font-semibold">Password</span>
          <input
            type="password"
            className="border-2 border-mint-green/60 rounded-xl p-2"
            placeholder="Masukan Password"
          />

          <button
            type="button"
            onClick={() =>
              navigate("/profile", {
                state: { name: "Demo User", email: "demo@example.com" },
              })
            }
            className="self-center mt-8 rounded-xl bg-pine-green text-white w-30 h-10 hover:bg-dark-green-teal transition"
          >
            Masuk
          </button>
        </form>
      </section>
    </div>
  );
}
