import "../styles/RegisterPage.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth.js";

function validatePassword(password = "") {
  if (password.length < 12) {
    return "Password minimal 12 karakter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password harus punya huruf kecil";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password harus punya huruf besar";
  }
  if (!/[0-9]/.test(password)) {
    return "Password harus punya angka";
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password harus punya simbol";
  }
  return "";
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password) {
      setError("Username, email, dan password wajib diisi");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    try {
      await authApi.register({ username, email, password });
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err?.message || "Gagal register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-white">
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#7c6af7] opacity-20 blur-[120px]" />
          <div className="absolute bottom-6 right-0 h-72 w-72 rounded-full bg-[#c8f560] opacity-15 blur-[140px]" />
        </div>

        <section className="relative z-10 grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center">
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              Peartone
            </h1>
          </div>

          <div className="relative z-10 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Register</h2>
                <p className="mt-1 text-sm text-white/60">Buat akun barumu sekarang.</p>
              </div>
            </div>

            <form className="register__form" onSubmit={handleRegister}>
              <label className="register__field">
                <span>Username</span>
                <input
                  type="text"
                  placeholder="Masukkan username"
                  className="register__input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </label>
              <label className="register__field">
                <span>Email</span>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  className="register__input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </label>
              <label className="register__field">
                <span>Password</span>
                <input
                  type="password"
                  placeholder="Buat password"
                  className="register__input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <small className="text-xs text-white/55 mt-1">
                  Gunakan minimal 12 karakter, campuran huruf besar-kecil, angka, dan simbol.
                </small>
              </label>
              <label className="register__field">
                <span>Konfirmasi Password</span>
                <input
                  type="password"
                  placeholder="Ulangi password"
                  className="register__input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </label>
              {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="register__button bg-green-600 text-white transition duration-150 hover:bg-green-700 disabled:opacity-60"
              >
                {loading ? "Loading..." : "Daftar"}
              </button>

              <p className="mt-3 text-sm text-white/70">
                Sudah punya akun?{" "}
                <Link to="/login" className="underline text-white">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

export default RegisterPage;
