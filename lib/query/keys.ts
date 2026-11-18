export const queryKeys = {
  movies: {
    all: ["movies"] as const,
    detail: (id: string) => ["movies", id] as const,
  },
  bookings: {
    all: ["bookings"] as const,
    list: (filter?: string) => ["bookings", { filter }] as const,
  },
  admin: {
    stats: ["admin", "stats"] as const,
    users: ["admin", "users"] as const,
    bookings: ["admin", "bookings"] as const,
  },
  blog: {
    posts: (category?: string, search?: string) =>
      ["blog", "posts", { category, search }] as const,
    post: (slug: string) => ["blog", "post", slug] as const,
  },
};
