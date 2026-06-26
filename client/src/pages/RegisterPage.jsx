import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth.js";

function validatePassword(password = "") {
  if (password.length < 12) return "Password must consists min. 12 characters";
  if (!/[a-z]/.test(password)) return "Password must consists lowercase letter(s)";
  if (!/[A-Z]/.test(password)) return "Password must consists uppercase letter(s)";
  if (!/[0-9]/.test(password)) return "Password must consists digit(s)";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must consists symbol(s)";
  return "";
}

const EyeToggle = ({ show, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center p-1 text-white/35"
    aria-label={show ? "Hide password" : "Show password"}
  >
    {show ? (
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
);

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password) return setError("Username, email, and password required");
    if (password !== confirmPassword) return setError("Password not matching!");

    const passwordError = validatePassword(password);
    if (passwordError) return setError(passwordError);

    setLoading(true);
    try {
      await authApi.register({ username, email, password });
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err?.message || "Failed to register");
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

      <div className="relative z-10 w-full max-w-[380px]">
        <div className="mb-6 text-center">
          <div className="text-[22px] font-bold tracking-[-0.02em]">Peartone</div>
          <div className="mt-1 text-xs text-white/35">Your music, your charts.</div>
        </div>

        <div className="rounded-[18px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="mb-5">
            <div className="text-[15px] font-semibold text-white/90">Create account</div>
            <div className="mt-1 text-xs text-white/35">Create your new account.</div>
          </div>

          <form onSubmit={handleRegister} className="flex w-full flex-col gap-4">
            <label className="flex w-full flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/40">
              <span>Username</span>
              <input
                type="text"
                placeholder="Enter your username"
                className="min-h-12 w-full appearance-none rounded-[10px] border border-white/10 bg-black/30 px-3.5 py-3 text-[15px] text-white outline-none transition placeholder:text-white/20 focus:border-[#c8f560] focus:ring-2 focus:ring-[#c8f560]/20"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </label>

            <label className="flex w-full flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/40">
              <span>Email</span>
              <input
                type="email"
                placeholder="example@email.com"
                className="min-h-12 w-full appearance-none rounded-[10px] border border-white/10 bg-black/30 px-3.5 py-3 text-[15px] text-white outline-none transition placeholder:text-white/20 focus:border-[#c8f560] focus:ring-2 focus:ring-[#c8f560]/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </label>

            <label className="flex w-full flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/40">
              <span>Password</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create your password"
                  className="min-h-12 w-full appearance-none rounded-[10px] border border-white/10 bg-black/30 px-3.5 py-3 pr-11 text-[15px] text-white outline-none transition placeholder:text-white/20 focus:border-[#c8f560] focus:ring-2 focus:ring-[#c8f560]/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <EyeToggle show={showPassword} onToggle={() => setShowPassword((v) => !v)} />
              </div>
              <span className="mt-0.5 text-[11px] normal-case tracking-normal text-white/30">
                Min. 12 characters, letters, digits & symbol(s).
              </span>
            </label>

            <label className="flex w-full flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/40">
              <span>Confirm Password</span>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="min-h-12 w-full appearance-none rounded-[10px] border border-white/10 bg-black/30 px-3.5 py-3 pr-11 text-[15px] text-white outline-none transition placeholder:text-white/20 focus:border-[#c8f560] focus:ring-2 focus:ring-[#c8f560]/20"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <EyeToggle show={showConfirm} onToggle={() => setShowConfirm((v) => !v)} />
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
              {loading ? "Registering…" : "Register"}
            </button>

            <div className="mt-1 text-center text-xs text-white/35">
              Have an account?{" "}
              <Link to="/login" className="text-white/70 underline underline-offset-2">
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