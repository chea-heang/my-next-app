import { NextResponse } from "next/server";
import { mockCurrentUser } from "@/lib/data";

// Demo in-memory users store
interface DemoUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  avatar?: string;
  role?: string;
  memberPoints?: number;
}

const usersDb: DemoUser[] = [
  {
    ...mockCurrentUser,
    password: "password123",
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, name, phone } = body;

    // Handle Login
    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json(
          { success: false, message: "សូមបញ្ចូល Email និង Password!" },
          { status: 400 }
        );
      }

      const cleanEmail = email.toLowerCase().trim();
      const existingUser = usersDb.find(
        (u) => u.email.toLowerCase().trim() === cleanEmail
      );

      if (existingUser) {
        if (existingUser.password && existingUser.password !== password) {
          return NextResponse.json(
            { success: false, message: "Password មិនត្រឹមត្រូវទេ!" },
            { status: 401 }
          );
        }

        const { password: _, ...userSafe } = existingUser;
        return NextResponse.json({
          success: true,
          message: "ចូលគណនីជោគជ័យ!",
          user: userSafe,
          token: `token_${Date.now()}_${existingUser.id}`,
        });
      }

      // If user not in initial mock list, allow flexible demo login
      const newUser: DemoUser = {
        id: `usr_${Date.now()}`,
        name: cleanEmail.split("@")[0],
        email: cleanEmail,
        phone: "012 345 678",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        role: "user",
        memberPoints: 100,
      };

      usersDb.push({ ...newUser, password });

      return NextResponse.json({
        success: true,
        message: "ចូលគណនីជោគជ័យ!",
        user: newUser,
        token: `token_${Date.now()}_${newUser.id}`,
      });
    }

    // Handle Register
    if (action === "register") {
      if (!name || !email || !password) {
        return NextResponse.json(
          { success: false, message: "សូមបំពេញឈ្មោះ អ៊ីមែល និងលេខសម្ងាត់ឱ្យបានគ្រប់ជ្រុងជ្រោយ!" },
          { status: 400 }
        );
      }

      const cleanEmail = email.toLowerCase().trim();
      const existingUser = usersDb.find(
        (u) => u.email.toLowerCase().trim() === cleanEmail
      );

      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "អ៊ីមែលនេះមានគណនីរួចហើយ! សូមចូលគណនី (Login)។" },
          { status: 400 }
        );
      }

      const newUser: DemoUser = {
        id: `usr_${Date.now()}`,
        name,
        email: cleanEmail,
        phone: phone || "012 000 000",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        role: "user",
        memberPoints: 50,
      };

      usersDb.push({ ...newUser, password });

      return NextResponse.json(
        {
          success: true,
          message: "ចុះឈ្មោះជោគជ័យ! អ្នកទទួលបាន 50 ពិន្ទុសម្រាប់ការចុះឈ្មោះដំបូង។",
          user: newUser,
          token: `token_${Date.now()}_${newUser.id}`,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "មានបញ្ហានៅលើ Server" },
      { status: 500 }
    );
  }
}

