import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decodeJwt, isTokenExpired } from "@/lib/jwt";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token || isTokenExpired(token)) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    const payload = decodeJwt(token);

    return NextResponse.json({
      authenticated: true,
      token,
      payload,
    });
  } catch (error) {
    return NextResponse.json(
      { authenticated: false, error: "Failed to read session" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, message: "Valid token required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const payload = decodeJwt(token);
    const nowSec = Math.floor(Date.now() / 1000);
    const maxAge =
      payload?.exp && payload.exp > nowSec
        ? payload.exp - nowSec
        : 7 * 24 * 60 * 60; // Default 7 days

    // Set HttpOnly secure cookie for edge middleware verification
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    return NextResponse.json({
      success: true,
      message: "Session cookie configured",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to set session cookie" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.set("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    cookieStore.delete("auth_token");

    return NextResponse.json({
      success: true,
      message: "Session cookie removed",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to clear session" },
      { status: 500 }
    );
  }
}
