export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "user" | "admin";
  memberPoints: number;
}

export interface BookingTicket {
  id: string;
  movieTitle: string;
  cinemaName: string;
  cinemaBrand: "Legend" | "Major" | "Prime" | "Platinum";
  date: string;
  time: string;
  hall: string;
  seats: string[];
  format: string;
  totalPriceUSD: number;
  totalPriceKHR: string;
  qrCode: string;
  status: "CONFIRMED" | "USED" | "CANCELLED";
  bookedAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  titleKh: string;
  titleEn: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: "ព័ត៌មានភាពយន្ត" | "បច្ចេកវិទ្យារោងកុន" | "Review" | "Events";
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  readTime: string;
  likes: number;
  commentsCount: number;
}

export interface BlogComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface Movie {
  id: string;
  title: string;
  titleKh?: string;
  part?: string;
  year: string;
  duration?: string;
  genre: string[];
  rating: number;
  price: number;
  image: string;
  status: "NOW_SHOWING" | "COMING_SOON" | "ARCHIVED";
  formats: string[];
}

export interface AdminStats {
  totalRevenueUSD: number;
  totalRevenueKHR: string;
  totalBookings: number;
  confirmedBookings: number;
  activeMovies: number;
  totalUsers: number;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  refresh_token?: string;
  user?: User;
}

