import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api/auth.js";
import { API_BASE } from "../api/client.js";

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
      await fetch(`${API_BASE}/auth/login`, {
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

  const handleGoogleAuth = () => {
    window.location.href = `${API_BASE}/auth/google`;
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#0d0d0f] px-4 py-6 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[20%] top-[-80px] h-[360px] w-[360px] rounded-full bg-[#7c6af7] opacity-10 blur-[120px]" />
        <div className="absolute bottom-0 right-[15%] h-[300px] w-[300px] rounded-full bg-[#c8f560] opacity-10 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-[360px]">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-black tracking-[-0.03em] uppercase bg-gradient-to-l from-brand-primary via-[#a8ea10] to-brand-secondary via-brand-primary to-[#a8ea10] bg-clip-text text-transparent bg-[length:200%_auto] animate-text-glow drop-shadow-[0_2px_8px_rgba(200,245,96,0.25)]">
            Peartone
          </h1>
          <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
            Your music, your charts.
          </p>
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

            <div className="relative my-2 flex items-center justify-center text-[10px] font-bold uppercase tracking-wider text-white/20">
              <div className="absolute left-0 right-0 h-[1px] bg-white/10" />
              <span className="relative z-10 bg-[#161619] px-3">Or continue with</span>
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="flex min-h-12 w-full items-center justify-center gap-3 rounded-[10px] border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10 active:scale-[0.98]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Google
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