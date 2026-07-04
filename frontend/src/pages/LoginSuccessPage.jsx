import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const LoginSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/", { replace: true });
    } else {
      console.error("No token found in redirect url parameters");
      navigate("/login?error=oauth_token_missing", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0d0d0f] text-white">
      <div className="text-center animate-pulse">
        <p className="text-sm font-semibold tracking-wider uppercase text-white/40">
          Authenticating account...
        </p>
      </div>
    </main>
  );
}

export default LoginSuccessPage;