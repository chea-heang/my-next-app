import { apiClient } from "./client";
import { Movie } from "@/types";

// Base catalog of movies
export const DEFAULT_MOVIES: Movie[] = [
  {
    id: "mov_1",
    title: "Spider-Man 1: ដើមកំណើត (Origin)",
    titleKh: "Spider-Man វគ្គ ១ : ដើមកំណើត",
    part: "1",
    year: "2002",
    duration: "121 min",
    genre: ["Action", "Sci-Fi", "Superhero"],
    rating: 8.5,
    price: 3.5,
    image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80",
    status: "NOW_SHOWING",
    formats: ["2D Standard", "VIP Lounge"],
  },
  {
    id: "mov_2",
    title: "Spider-Man 2: សត្រូវដៃដែក (Doc Ock)",
    titleKh: "Spider-Man វគ្គ ២ : សត្រូវដៃដែក",
    part: "2",
    year: "2004",
    duration: "127 min",
    genre: ["Action", "Sci-Fi", "Adventure"],
    rating: 9.0,
    price: 3.5,
    image: "https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?auto=format&fit=crop&w=800&q=80",
    status: "NOW_SHOWING",
    formats: ["2D Digital", "Dolby Atmos"],
  },
  {
    id: "mov_3",
    title: "Spider-Man 3: ឈុតខ្មៅ Venom",
    titleKh: "Spider-Man វគ្គ ៣ : Black Suit",
    part: "3",
    year: "2007",
    duration: "139 min",
    genre: ["Action", "Fantasy", "Sci-Fi"],
    rating: 7.8,
    price: 3.5,
    image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=800&q=80",
    status: "NOW_SHOWING",
    formats: ["2D Digital", "IMAX 2D"],
  },
  {
    id: "mov_4",
    title: "The Amazing Spider-Man",
    titleKh: "The Amazing Spider-Man (Andrew Garfield)",
    part: "4",
    year: "2012",
    duration: "136 min",
    genre: ["Action", "Romance", "Sci-Fi"],
    rating: 8.2,
    price: 4.0,
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    status: "NOW_SHOWING",
    formats: ["3D Digital", "4DX Motion"],
  },
  {
    id: "mov_5",
    title: "Spider-Man: No Way Home",
    titleKh: "Spider-Man: គ្មានផ្លូវត្រឡប់មកវិញ (No Way Home)",
    part: "5",
    year: "2021",
    duration: "148 min",
    genre: ["Action", "Adventure", "Multiverse"],
    rating: 9.5,
    price: 5.5,
    image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80",
    status: "NOW_SHOWING",
    formats: ["IMAX Laser 3D", "ScreenX 270°", "4DX"],
  },
  {
    id: "mov_6",
    title: "Spider-Man: Beyond the Spider-Verse",
    titleKh: "Spider-Man: ពហុចក្រវាលហួសដែនកំណត់ (Beyond Multiverse)",
    part: "6",
    year: "2026",
    duration: "140 min",
    genre: ["Animation", "Action", "Multiverse"],
    rating: 9.8,
    price: 6.0,
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    status: "COMING_SOON",
    formats: ["IMAX Laser 3D", "ScreenX", "Dolby Atmos"],
  },
];

let localMovies: Movie[] = [...DEFAULT_MOVIES];

export const moviesApi = {
  /**
   * Get all movies
   */
  async getMovies(): Promise<Movie[]> {
    try {
      const res = await apiClient.get<Movie[]>("/movies");
      if (Array.isArray(res) && res.length > 0) {
        return res;
      }
    } catch {
      // Backend offline or endpoint not registered yet
    }
    return localMovies;
  },

  /**
   * Get movie by ID
   */
  async getMovieById(id: string): Promise<Movie | null> {
    try {
      const res = await apiClient.get<Movie>(`/movies/${id}`);
      if (res && res.id) return res;
    } catch {}
    return localMovies.find((m) => m.id === id) || null;
  },

  /**
   * Add movie (Admin)
   */
  async createMovie(data: Omit<Movie, "id">): Promise<Movie> {
    try {
      const res = await apiClient.post<Movie>("/movies", data);
      if (res && res.id) {
        localMovies = [res, ...localMovies];
        return res;
      }
    } catch {}

    const newMovie: Movie = {
      ...data,
      id: `mov_${Date.now()}`,
    };
    localMovies = [newMovie, ...localMovies];
    return newMovie;
  },

  /**
   * Delete movie (Admin)
   */
  async deleteMovie(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/movies/${id}`);
    } catch {}
    localMovies = localMovies.filter((m) => m.id !== id);
    return true;
  },
};
