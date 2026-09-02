import { NextResponse } from "next/server";
import { mockTickets } from "@/lib/data";
import { BookingTicket } from "@/types";

let currentTickets: BookingTicket[] = [...mockTickets];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: currentTickets,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTicket: BookingTicket = {
      id: `TCK-${Math.floor(10000 + Math.random() * 90000)}`,
      movieTitle: body.movieTitle || "Spider-Man",
      cinemaName: body.cinemaName || "Legend Cinema",
      cinemaBrand: body.cinemaBrand || "Legend",
      date: body.date || new Date().toISOString().split("T")[0],
      time: body.time || "18:00",  
      hall: body.hall || "Hall 1",
      seats: body.seats || ["A1"],
      format: body.format || "2D Digital",
      totalPriceUSD: body.totalPriceUSD || 5.0,
      totalPriceKHR: body.totalPriceKHR || "20,500",
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TCK-DEMO-${Date.now()}`,
      status: "CONFIRMED",
      bookedAt: new Date().toLocaleString(),
    };

    currentTickets = [newTicket, ...currentTickets];

    return NextResponse.json({
      success: true,
      message: "បានកក់សំបុត្រជោគជ័យ!",
      data: newTicket,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "ការកក់មិនជោគជ័យ សូមព្យាយាមម្តងទៀត" },
      { status: 400 }
    ); 
  } 
}
