import { useState } from 'react';
import styles from "./App.module.css"
import toast, { Toaster } from 'react-hot-toast';
import { fetchMovies } from '../../services/movieservice';
import { type Movie } from '../../types/movie';
import  SearchBar  from '../SearchBar/SearchBar';
import  MovieGrid  from '../MovieGrid/MovieGrid';
import  Loader  from '../Loader/Loader';
import  ErrorMessage  from '../ErrorMessage/ErrorMessage';
import  MovieModal  from '../MovieModal/MovieModal';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  async function handleSearch(query: string) {
    setLoading(true);
    setError(false);
    setMovies([]);
    try {
      const result = await fetchMovies(query);
      if (result.length === 0) {
        toast.error('No movies found for your request.');
      }
      setMovies(result);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.app}>
      <SearchBar onSubmit={handleSearch} />
      {loading && <Loader />}
      {error && <ErrorMessage />}
      {!loading && !error && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
      <Toaster />
    </div>
  );
}
//1