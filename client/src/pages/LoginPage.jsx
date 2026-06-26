import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      await authApi.loginAndStore({ username, password });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.message || "Error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#0d0d0f] px-4 py-6 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[20%] top-[-80px] h-[360px] w-[360px] rounded-full bg-[#7c6af7] opacity-10 blur-[120px]" />
        <div className="absolute bottom-0 right-[15%] h-[300px] w-[300px] rounded-full bg-[#c8f560] opacity-10 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-[360px]">
        <div className="mb-6 text-center">
          <div className="text-[22px] font-bold tracking-[-0.02em]">Peartone</div>
          <div className="mt-1 text-xs text-white/35">Your music, your charts.</div>
        </div>

        <div className="rounded-[18px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="mb-5">
            <div className="text-[15px] font-semibold text-white/90">Sign in</div>
            <div className="mt-1 text-xs text-white/35">
              Welcome back — enter your details below.
            </div>
          </div>

          <form onSubmit={handleLogin} className="flex w-full flex-col gap-4">
            <label className="flex w-full flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/40">
              <span>Username</span>
              <input
                type="text"
                className="min-h-12 w-full appearance-none rounded-[10px] border border-white/10 bg-black/30 px-3.5 py-3 text-[15px] text-white outline-none transition placeholder:text-white/20 focus:border-[#c8f560] focus:ring-2 focus:ring-[#c8f560]/20"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="e.g. bolstar32"
              />
            </label>

            <label className="flex w-full flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/40">
              <span>Password</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="min-h-12 w-full appearance-none rounded-[10px] border border-white/10 bg-black/30 px-3.5 py-3 pr-11 text-[15px] text-white outline-none transition placeholder:text-white/20 focus:border-[#c8f560] focus:ring-2 focus:ring-[#c8f560]/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center p-1 text-white/35"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </label>

            {error && (
              <div className="rounded-lg border border-red-400/25 bg-red-400/10 px-3 py-2.5 text-xs text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex min-h-12 w-full items-center justify-center rounded-[10px] bg-[#c8f560] px-6 py-3 text-sm font-semibold tracking-[0.03em] text-[#0d0d0f] shadow-[0_4px_16px_rgba(200,245,96,0.25)] transition hover:shadow-[0_8px_24px_rgba(200,245,96,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Login"}
            </button>

            <div className="mt-1 text-center text-xs text-white/35">
              No account?{" "}
              <Link to="/register" className="text-white/70 underline underline-offset-2">
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}