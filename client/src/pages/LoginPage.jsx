import "../styles/LoginPage.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload?.message || "Login gagal");

      // backend kamu mengembalikan { data: { token, user }, message, status } (dari auth.service.js)
      const token = payload?.data?.token;
      const user = payload?.data?.user;

      if (!token) throw new Error("Token tidak ditemukan di response login");

      localStorage.setItem("token", token);
      if (user) localStorage.setItem("pt_user", JSON.stringify(user));

      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-white">
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12">
        <section className="relative z-10 grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center">
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              Peartone
            </h1>
          </div>

          <div className="relative z-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
            <h2 className="text-2xl font-semibold">Login</h2>

            <form className="login__form" onSubmit={handleLogin}>
              <label className="login__field">
                <span>Username</span>
                <input
                  type="text"
                  className="login__input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </label>

              <label className="login__field">
                <span>Password</span>
                <input
                  type="password"
                  className="login__input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </label>

              {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="login__button bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
              >
                {loading ? "Loading..." : "Login"}
              </button>

              <p className="mt-3 text-sm text-white/70">
                Belum punya akun?{" "}
                <Link to="/register" className="underline text-white">
                  Register
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}