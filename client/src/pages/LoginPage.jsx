import "../styles/LoginPage.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload?.message || "Login gagal");

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

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "360px" }}>
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
            <div style={{ fontSize: "15px", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>Sign in</div>
            <div style={{ marginTop: "3px", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>Welcome back — enter your details below.</div>
          </div>

          <form className="login__form" onSubmit={handleLogin}>
            <label className="login__field">
              <span>Username</span>
              <input
                type="text"
                className="login__input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="e.g. bolstar32"
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
                placeholder="••••••••"
              />
            </label>

            {error && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "10px 12px", fontSize: "12px", color: "#f87171" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="login__button">
              {loading ? "Signing in…" : "Login"}
            </button>

            <div style={{ textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "4px" }}>
              Belum punya akun?{" "}
              <Link to="/register" style={{ color: "rgba(255,255,255,0.65)", textDecoration: "underline", textUnderlineOffset: "2px" }}>
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}