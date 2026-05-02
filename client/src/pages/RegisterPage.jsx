import "../styles/RegisterPage.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth.js";

function validatePassword(password = "") {
  if (password.length < 12) return "Password minimal 12 karakter";
  if (!/[a-z]/.test(password)) return "Password harus punya huruf kecil";
  if (!/[A-Z]/.test(password)) return "Password harus punya huruf besar";
  if (!/[0-9]/.test(password)) return "Password harus punya angka";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password harus punya simbol";
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
    <main
      style={{
        minHeight: "100svh",
        background: "#0d0d0f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        color: "#fff",
      }}
    >
      <div style={{ pointerEvents: "none", position: "fixed", inset: 0, overflow: "hidden", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-80px", left: "20%", width: "360px", height: "360px", borderRadius: "50%", background: "#7c6af7", opacity: 0.08, filter: "blur(120px)" }} />
        <div style={{ position: "absolute", bottom: "0", right: "15%", width: "300px", height: "300px", borderRadius: "50%", background: "#c8f560", opacity: 0.08, filter: "blur(100px)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "380px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em" }}>Peartone</div>
          <div style={{ marginTop: "4px", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>Your music, your charts.</div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "18px",
            padding: "24px",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "15px", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>Create account</div>
            <div style={{ marginTop: "3px", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>Buat akun barumu sekarang.</div>
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
              <span className="register__hint">
                Min. 12 karakter, huruf besar-kecil, angka & simbol.
              </span>
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

            {error && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "10px 12px", fontSize: "12px", color: "#f87171" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="register__button">
              {loading ? "Mendaftar…" : "Daftar"}
            </button>

            <div style={{ textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "4px" }}>
              Sudah punya akun?{" "}
              <Link to="/login" style={{ color: "rgba(255,255,255,0.65)", textDecoration: "underline", textUnderlineOffset: "2px" }}>
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;