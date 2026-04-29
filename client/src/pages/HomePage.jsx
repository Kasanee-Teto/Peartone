import ChartList from "../components/ChartList";
import PopularList from "../components/PopularList";
import useFetch from "../hooks/useFetch";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const HomePage = () => {
  const {
    data: chartsData,
    loading: chartsLoading,
    error: chartsError,
  } = useFetch(`${BASE_URL}/charts`);

  const {
    data: popularData,
    loading: popularLoading,
    error: popularError,
  } = useFetch(`${BASE_URL}/popular`);

  const charts = Array.isArray(chartsData)
    ? chartsData
    : chartsData?.data ?? [];

  const popular = Array.isArray(popularData)
    ? popularData
    : popularData?.data ?? [];

  return (
    <main className="home" aria-label="Halaman Utama Peartone">
      <section className="home__hero" aria-label="Banner Peartone">
        <div className="home__hero-content">
          <h1 className="home__hero-title">
            Temukan Musik<br />
            <span className="home__hero-accent">Favoritmu</span>
          </h1>
          <p className="home__hero-subtitle">
            Streaming musik tanpa batas. Dengarkan chart terpopuler dan temukan lagu baru setiap hari.
          </p>
          <button className="home__hero-cta" aria-label="Mulai mendengarkan">
            Mulai Dengarkan
          </button>
        </div>
      </section>

      <ChartList charts={charts} loading={chartsLoading} error={chartsError} />
      <PopularList popular={popular} loading={popularLoading} error={popularError} />
    </main>
  );
};

export default HomePage;