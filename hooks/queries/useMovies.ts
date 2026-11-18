import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { moviesApi } from "@/lib/api/movies";
import { adminApi } from "@/lib/api/admin";
import { queryKeys } from "@/lib/query/keys";
import { Movie } from "@/types";

export function useMovies() {
  return useQuery({
    queryKey: queryKeys.movies.all,
    queryFn: () => moviesApi.getMovies(),
  });
}

export function useCreateMovie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newMovie: Omit<Movie, "id">) => adminApi.addMovie(newMovie),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.movies.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats });
    },
  });
}

export function useDeleteMovie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.movies.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats });
    },
  });
}
