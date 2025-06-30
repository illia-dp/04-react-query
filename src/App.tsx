import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SearchBar from "./components/SearchBar/SearchBar";
import { fetchMovies } from "./services/themoviedbAPI";
import type { Movie } from "./types/movie";
import Loader from "./components/Loader/Loader";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import MovieGrid from "./components/MovieGrid/MovieGrid";
import css from "./App.module.css";
import MovieModal from "./components/MovieModal/MovieModal";

function App() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSubmit = (query: string) => {
    setQuery(query);
  };

  useEffect(() => {
    if (!query) return;

    const getMoviesByQuery = async () => {
      setIsLoading(true);
      setError(null);
      setMovies([]);

      try {
        const { data } = await fetchMovies(query);
        if (data.lenght === 0) {
          toast.error("No movies found for your request.");
        } else {
          setMovies(data.results);
        }
      } catch {
        setError("Error fetching movies");
        toast.error("There was an error, please try again...");
      } finally {
        setIsLoading(false);
      }
    };
    getMoviesByQuery();
  }, [query]);

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSubmit} />
      {isLoading && <Loader />}
      {error && <ErrorMessage />}

      {movies.length > 0 && !isLoading && !error && (
        <MovieGrid onSelect={openModal} movies={movies} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}

export default App;
