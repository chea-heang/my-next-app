import { BlogPost, BookingTicket, User } from "@/types";

export const mockCurrentUser: User = {
  id: "usr_1",
  name: "ចាន់ វាសនា (Veasna Chan)",
  email: "veasna.chan@example.com",
  phone: "012 345 678",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
  role: "user",
  memberPoints: 350,
};

export const mockTickets: BookingTicket[] = [
  {
    id: "TCK-89211",
    movieTitle: "Spider-Man: Beyond the Spider-Verse",
    cinemaName: "Major Cineplex អ៊ីអន មានជ័យ (Aeon 3)",
    cinemaBrand: "Major",
    date: "2026-08-30",
    time: "19:30",
    hall: "IMAX Laser Hall 1",
    seats: ["F12", "F13"],
    format: "IMAX Laser 3D",
    totalPriceUSD: 14.0,
    totalPriceKHR: "57,400",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TCK-89211-SPIDERMAN-AEON3",
    status: "CONFIRMED",
    bookedAt: "2026-08-27 10:45",
  },
  {
    id: "TCK-77402",
    movieTitle: "Spider-Man: Across the Spider-Verse",
    cinemaName: "Legend Cinema អ៊ីដិន ហ្គាឌិន (Eden Garden)",
    cinemaBrand: "Legend",
    date: "2026-08-15",
    time: "16:00",
    hall: "ScreenX Hall 3",
    seats: ["E08"],
    format: "ScreenX 2D",
    totalPriceUSD: 6.5,
    totalPriceKHR: "26,650",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TCK-77402-SPIDERMAN-EDEN",
    status: "USED",
    bookedAt: "2026-08-14 09:20",
  },
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: "post_1",
    slug: "top-cinemas-cambodia-imax-screenx-2026",
    titleKh: "ប្រៀបធៀបបច្ចេកវិទ្យា IMAX Laser, ScreenX និង 4DX នៅរោងកុនកម្ពុជា ២០២៦",
    titleEn: "Comparing IMAX Laser, ScreenX & 4DX in Cambodia Cinemas 2026",
    excerpt: "ស្វែងយល់ពីភាពខុសគ្នារវាងអេក្រង់យក្ស IMAX Laser នៅ Aeon 3, បច្ចេកវិទ្យាបញ្ចាំង 3 ជ្រុង ScreenX នៅ Eden Garden និងកៅអីរំញ័រ 4DX នៅ Major Cineplex!",
    content: `បច្ចុប្បន្ននេះ រោងភាពយន្តនៅកម្ពុជាមានការរីកចម្រើនយ៉ាងខ្លាំងជាមួយនឹងបច្ចេកវិទ្យាទំនើបៗជាច្រើនជម្រើស៖

### ១. IMAX Laser (Aeon Mall Mean Chey - Aeon 3)
បច្ចេកវិទ្យា IMAX Laser ផ្តល់ជូននូវកម្រិតពន្លឺភ្លឺច្បាស់ជាងម៉ាស៊ីនបញ្ចាំងធម្មតាដល់ទៅ ២ ដង និងសំឡេង Dolby Atmos ជុំទិស ១២ ប៉ុស្តិ៍។ អេក្រង់មានទំហំធំទូលាយពីកម្រាលរហូតដល់ពិដាន ធ្វើឱ្យអ្នកទស្សនាមានអារម្មណ៍ដូចកំពុងស្ថិតក្នុងឈុតភាពយន្តផ្ទាល់។

### ២. ScreenX (Legend Cinema Eden Garden)
ScreenX ប្រើប្រាស់អេក្រង់បញ្ចាំងដល់ទៅ ៣ ជ្រុង (២៧០ ដឺក្រេ) ដែលពង្រីកទិដ្ឋភាពទៅកាន់ជញ្ជាំងសងខាងនៃសាល។ ស័ក្តិសមបំផុតសម្រាប់ខ្សែភាពយន្តបែប Action & Sci-Fi ដូចជា Spider-Man។

### ៣. 4DX Experience
សម្រាប់អ្នកចូលចិត្តបទពិសោធន៍រំញោចអារម្មណ៍ កៅអីចលនា 4DX អាចបត់បែន ញ័រ ព្រមទាំងមានបែបផែនខ្យល់ ទឹក ផ្សែង និងក្លិន ស្របតាមចលនាក្នុងរឿង។`,
    coverImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    category: "បច្ចេកវិទ្យារោងកុន",
    author: {
      name: "សុខ សុភ័ក្ត្រ (Sopheak Sok)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "Cinema & Tech Reviewer",
    },
    publishedAt: "2026-08-25",
    readTime: "៤ នាទី",
    likes: 142,
    commentsCount: 18,
  },
  {
    id: "post_2",
    slug: "spiderman-beyond-spiderverse-release-date-cambodia",
    titleKh: "Spider-Man: Beyond the Spider-Verse ត្រៀមកក្រើករោងកុននៅកម្ពុជា!",
    titleEn: "Spider-Man: Beyond the Spider-Verse Release Updates in Cambodia",
    excerpt: "ដំណើរផ្សងព្រេងបន្តរបស់ Miles Morales ក្នុងពិភពពហុចក្រវាល Multiverse ត្រៀមចាក់បញ្ចាំងគ្រប់រោងភាពយន្តធំៗក្នុងរាជធានីភ្នំពេញ និងតាមបណ្តាខេត្ត។",
    content: `អ្នកគាំទ្រ Spider-Man នៅកម្ពុជាត្រៀមខ្លួនទទួលយកបទពិសោធន៍ដ៏អស្ចារ្យ! ខ្សែភាពយន្តគំនូរជីវចលលំដាប់ពិភពលោក Spider-Man: Beyond the Spider-Verse នឹងមកដល់គ្រប់រោងភាពយន្តក្នុងប្រទេសកម្ពុជា។

### ចំណុចពិសេសដែលមិនគួររំលង៖
- **Animation Style:** ការរួមបញ្ចូលគ្នារវាង 2D និង 3D Animation បែប Comic Book ដ៏រស់រវើក
- **Multiverse Characters:** ការបង្ហាញខ្លួនរបស់ Spider-Heroes ថ្មីៗរាប់សិបនាក់
- **Soundtrack:** បទភ្លេង Soundtrack ថ្មីៗពីសិល្បករកំពូលៗ`,
    coverImage: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=1200&q=80",
    category: "ព័ត៌មានភាពយន្ត",
    author: {
      name: "រិទ្ធី ដារ៉ា (Dara Rithy)",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      role: "Movie Enthusiast",
    },
    publishedAt: "2026-08-26",
    readTime: "៣ នាទី",
    likes: 215,
    commentsCount: 24,
  },
];
