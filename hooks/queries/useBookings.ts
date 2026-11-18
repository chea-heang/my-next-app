import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingsApi } from "@/lib/api/bookings";
import { queryKeys } from "@/lib/query/keys";
import { BookingTicket } from "@/types";

export function useBookings(filter?: string) {
  return useQuery({
    queryKey: filter ? queryKeys.bookings.list(filter) : queryKeys.bookings.all,
    queryFn: () => bookingsApi.getBookings(),
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      payload: Omit<BookingTicket, "id" | "status" | "bookedAt" | "qrCode"> & {
        id?: string;
        qrCode?: string;
      }
    ) => bookingsApi.createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.bookings });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingsApi.cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.bookings });
    },
  });
}
