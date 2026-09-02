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
