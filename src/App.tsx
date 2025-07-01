import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fetchMovies } from "./services/themoviedbAPI";
import type { Movie, MovieResponse } from "./types/movie";
import SearchBar from "./components/SearchBar/SearchBar";
import MovieGrid from "./components/MovieGrid/MovieGrid";
import Loader from "./components/Loader/Loader";
import MovieModal from "./components/MovieModal/MovieModal";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";

function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSubmit = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1);
  };

  const { data, isLoading, isError } = useQuery<MovieResponse>({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
  });

  useEffect(() => {
    if (
      page === 1 &&
      query.trim() !== "" &&
      data &&
      data.results.length === 0 &&
      !isLoading &&
      !isError
    ) {
      toast.error("No movies found for your request.");
    }
  }, [data, page, query, isLoading, isError]);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSubmit} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={handlePageChange}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {movies.length > 0 && (
        <>
          <MovieGrid movies={movies} onSelect={openModal} />
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}

export default App;
