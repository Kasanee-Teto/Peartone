import "../styles/RegisterPage.css";

const RegisterPage = () => {
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

            <form className="register__form">
              <label className="register__field">
                <span>Username</span>
                <input
                  type="text"
                  placeholder="Masukkan username"
                  className="register__input"
                />
              </label>
              <label className="register__field">
                <span>Email</span>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  className="register__input"
                />
              </label>
              <label className="register__field">
                <span>Password</span>
                <input
                  type="password"
                  placeholder="Buat password"
                  className="register__input"
                />
              </label>
              <label className="register__field">
                <span>Konfirmasi Password</span>
                <input
                  type="password"
                  placeholder="Ulangi password"
                  className="register__input"
                />
              </label>
            </form>

            <button className="register__button bg-green-600 text-white transition duration-150 hover:bg-green-700">
              Daftar
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default RegisterPage;
