import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchMovies = async (query: string, page: number) => {
  const response = await axios.get(`${BASE_URL}/search/movie`, {
    params: {
      query,
      page,
    },
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return response.data;
};
