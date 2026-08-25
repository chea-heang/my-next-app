"use client";

import React, { useState, useEffect } from "react";

export interface BookingMovieData {
  id: number;
  title: string;
  part: string;
  price: number;
  image: string;
  tag: string;
  year: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: BookingMovieData | null;
  defaultCinema?: string;
}

const cinemaOptions = [
  "Major Cineplex អ៊ីអន មានជ័យ (Aeon 3)",
  "Legend Cinema អ៊ីដិន ហ្កាឌិន (Eden Garden)",
  "Major Cineplex អ៊ីអន សែនសុខ (Aeon 2)",
  "Legend Cinema អ៊ិចឆេង ស្ឃ្វែរ (Exchange Square)",
  "Prime Cineplex សម័យ ស្ឃ្វែរ (Samai Square)",
  "Major Cineplex សៀមរាប (Heritage Walk)",
  "Legend Cinema ព្រះសីហនុ (Prince Mall)",
  "Legend Cinema ជីប ម៉ុង ២៧១ (Chip Mong 271)",
];

const hallFormats = [
  { name: "2D Standard Digital", extra: 0, icon: "🎬" },
  { name: "3D RealD Surround", extra: 1.5, icon: "👓" },
  { name: "IMAX Laser 3D", extra: 4.0, icon: "🌟" },
  { name: "4DX Motion Effects", extra: 4.5, icon: "⚡" },
  { name: "VIP Diamond Sofa", extra: 6.0, icon: "🛋️" },
];

const timeSlots = ["10:30 AM", "01:15 PM", "04:00 PM", "06:45 PM", "09:30 PM"];

const dateOptions = [
  { label: "ថ្ងៃនេះ (Today)", date: "25 សីហា" },
  { label: "ថ្ងៃស្អែក (Tomorrow)", date: "26 សីហា" },
  { label: "ថ្ងៃបន្ទាប់", date: "27 សីហា" },
];

export default function BookingModal({
  isOpen,
  onClose,
  movie,
  defaultCinema,
}: BookingModalProps) {
  const [step, setStep] = useState<"details" | "payment" | "success">("details");
  const [selectedCinema, setSelectedCinema] = useState<string>(
    defaultCinema || cinemaOptions[0]
  );
  const [selectedFormat, setSelectedFormat] = useState(hallFormats[0]);
  const [selectedDate, setSelectedDate] = useState(dateOptions[0].label);
  const [selectedTime, setSelectedTime] = useState(timeSlots[2]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>(["B3", "B4"]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Payment states
  const [selectedBank, setSelectedBank] = useState<"ABA" | "ACLEDA">("ABA");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [slipAttached, setSlipAttached] = useState<boolean>(false);

  useEffect(() => {
    if (defaultCinema) {
      setSelectedCinema(defaultCinema);
    }
  }, [defaultCinema]);

  if (!isOpen || !movie) return null;

  const seatRows = ["A", "B", "C", "D"];
  const occupiedSeats = ["A2", "B5", "C3", "C4", "D6"];

  const toggleSeat = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= 8) {
        alert("អាចជ្រើសរើសបានអតិបរមា ៨ កៅអី!");
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const seatPrice = movie.price + selectedFormat.extra;
  const totalPrice = seatPrice * selectedSeats.length;
  const totalPriceKHR = Math.round(totalPrice * 4100).toLocaleString();

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSeats.length === 0) {
      alert("សូមជ្រើសរើសកៅអីយ៉ាងហោចណាស់ ១!");
      return;
    }
    if (!customerPhone.trim()) {
      alert("សូមបញ្ចូលលេខទូរស័ព្ទដើម្បីទទួលសំបុត្រ!");
      return;
    }
    setStep("payment");
  };

  const handleConfirmPayment = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const ref = "SPIDER-" + Math.floor(100000 + Math.random() * 900000);
      setBookingRef(ref);
      setStep("success");
    }, 1200);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const resetAndClose = () => {
    setStep("details");
    setSelectedSeats(["B3", "B4"]);
    setIsVerifying(false);
    setSlipAttached(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden my-6 transition-all">
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-red-600 via-rose-600 to-indigo-600 p-4 sm:p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md text-xl">
              {step === "payment" ? "💳" : step === "success" ? "🎉" : "🎟️"}
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-black">
                {step === "payment"
                  ? "ទូទាត់ប្រាក់តាម KHQR (ABA & ACLEDA)"
                  : step === "success"
                    ? "កក់សំបុត្របានជោគជ័យ!"
                    : movie.title}
              </h3>
              <p className="text-xs text-red-100 font-medium">
                {step === "payment"
                  ? `ចំនួនទឹកប្រាក់ដែលត្រូវបង់: $${totalPrice.toFixed(2)} (${totalPriceKHR} ៛)`
                  : `${movie.tag} • តម្លៃ: $${movie.price.toFixed(2)}/កៅអី`}
              </p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="rounded-full h-8 w-8 bg-black/20 hover:bg-black/40 flex items-center justify-center text-white font-bold transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-gray-100 dark:bg-gray-800/80 px-6 py-2 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center text-xs font-bold">
          <span
            className={`flex items-center gap-1.5 ${step === "details"
                ? "text-red-600 dark:text-red-400"
                : "text-gray-400"
              }`}
          >
            <span className="h-5 w-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">
              1
            </span>
            ព័ត៌មានកក់
          </span>
          <span className="text-gray-300 dark:text-gray-700">→</span>
          <span
            className={`flex items-center gap-1.5 ${step === "payment"
                ? "text-red-600 dark:text-red-400"
                : "text-gray-400"
              }`}
          >
            <span
              className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${step === "payment"
                  ? "bg-red-600 text-white"
                  : "bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                }`}
            >
              2
            </span>
            ស្កេនបង់ប្រាក់ QR
          </span>
          <span className="text-gray-300 dark:text-gray-700">→</span>
          <span
            className={`flex items-center gap-1.5 ${step === "success"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-gray-400"
              }`}
          >
            <span
              className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${step === "success"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                }`}
            >
              3
            </span>
            ទទួលសំបុត្រ
          </span>
        </div>

        {/* STEP 1: Details Form */}
        {step === "details" && (
          <form
            onSubmit={handleProceedToPayment}
            className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto"
          >
            {/* 1. Cinema Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                🏢 ជ្រើសរើសរោងភាពយន្ត:
              </label>
              <select
                value={selectedCinema}
                onChange={(e) => setSelectedCinema(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
              >
                {cinemaOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Format & Hall selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                📽️ ប្រភេទសាល និងបច្ចេកវិទ្យា:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {hallFormats.map((format) => {
                  const isSelected = selectedFormat.name === format.name;
                  const priceFormatted = (movie.price + format.extra).toFixed(2);
                  return (
                    <button
                      type="button"
                      key={format.name}
                      onClick={() => setSelectedFormat(format)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${isSelected
                          ? "border-red-500 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold shadow-sm"
                          : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
                        }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{format.icon}</span>
                        <span className="truncate">{format.name}</span>
                      </div>
                      <div className="mt-1 font-black text-red-600 dark:text-red-400">
                        ${priceFormatted}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                  📅 កាលបរិច្ឆេទ:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {dateOptions.map((d) => (
                    <button
                      type="button"
                      key={d.label}
                      onClick={() => setSelectedDate(d.label)}
                      className={`p-2 rounded-xl text-center text-xs font-bold transition cursor-pointer ${selectedDate === d.label
                          ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        }`}
                    >
                      <div>{d.label.split(" ")[0]}</div>
                      <div className="text-[10px] font-normal opacity-80">{d.date}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                  ⏰ ម៉ោងបញ្ចាំង:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {timeSlots.map((time) => (
                    <button
                      type="button"
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${selectedTime === time
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Interactive Seat Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  🪑 ជ្រើសរើសកៅអី (Screen)
                </label>
                <div className="flex items-center gap-3 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="h-3 w-3 rounded bg-gray-200 dark:bg-gray-700 inline-block" />
                    ទំនេរ
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-3 w-3 rounded bg-red-600 inline-block" />
                    បានជ្រើសរើស
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-3 w-3 rounded bg-gray-400 dark:bg-gray-800 inline-block opacity-40" />
                    ពេញ
                  </span>
                </div>
              </div>

              {/* Screen Bar */}
              <div className="relative mb-3 text-center">
                <div className="h-1.5 w-3/4 mx-auto bg-gradient-to-r from-red-500 via-rose-400 to-indigo-500 rounded-full shadow-md shadow-red-500/20" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1 block">
                  អេក្រង់បញ្ចាំង (SCREEN)
                </span>
              </div>

              {/* Seats Grid */}
              <div className="bg-gray-50 dark:bg-gray-950/40 p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2">
                {seatRows.map((row) => (
                  <div key={row} className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <span className="w-4 text-xs font-bold text-gray-400 text-center">
                      {row}
                    </span>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                      const seatId = `${row}${num}`;
                      const isOccupied = occupiedSeats.includes(seatId);
                      const isSelected = selectedSeats.includes(seatId);

                      return (
                        <button
                          type="button"
                          key={seatId}
                          disabled={isOccupied}
                          onClick={() => toggleSeat(seatId)}
                          className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${isOccupied
                              ? "bg-gray-300 dark:bg-gray-800 text-gray-400 cursor-not-allowed opacity-40"
                              : isSelected
                                ? "bg-red-600 text-white shadow-md shadow-red-600/40 scale-105"
                                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                            }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Customer Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">
                  ឈ្មោះអ្នកកក់:
                </label>
                <input
                  type="text"
                  placeholder="ឈ្មោះរបស់អ្នក"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">
                  លេខទូរស័ព្ទ (Telegram ទទួលសំបុត្រ): <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="ឧ. 012 345 678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* 6. Pricing Summary & Proceed to Payment Button */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    កៅអី: {selectedSeats.join(", ") || "មិនទាន់ជ្រើស"} ({selectedSeats.length} កៅអី)
                  </span>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    តម្លៃ: ${seatPrice.toFixed(2)}/កៅអី
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    សរុបទឹកប្រាក់:
                  </span>
                  <div className="text-2xl font-black text-red-600 dark:text-red-400">
                    ${totalPrice.toFixed(2)}
                  </div>
                  <div className="text-[11px] font-semibold text-gray-500">
                    ≈ {totalPriceKHR} រៀល
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-base shadow-xl shadow-red-600/30 transition hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>💳 បន្តទៅការបង់ប្រាក់តាម QR (${totalPrice.toFixed(2)})</span>
                <span>→</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: KHQR Payment Screen (ABA & ACLEDA) */}
        {step === "payment" && (
          <div className="p-5 sm:p-6 space-y-5 max-h-[78vh] overflow-y-auto">
            {/* Amount Banner */}
            <div className="bg-gradient-to-r from-red-50 via-rose-50 to-indigo-50 dark:from-red-950/40 dark:via-rose-950/30 dark:to-indigo-950/40 border border-red-200/80 dark:border-red-900/50 rounded-2xl p-4 text-center">
              <span className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">
                ចំនួនទឹកប្រាក់ត្រូវទូទាត់ (Payment Amount)
              </span>
              <div className="text-3xl font-black text-red-600 dark:text-red-400 mt-0.5">
                ${totalPrice.toFixed(2)}
                <span className="text-sm font-bold text-gray-600 dark:text-gray-300 ml-2">
                  ({totalPriceKHR} ៛)
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {movie.title} • {selectedCinema} • {selectedSeats.length} កៅអី ({selectedSeats.join(", ")})
              </p>
            </div>

            {/* Bank Choice Tabs (ABA vs ACLEDA) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">
                🏦 ជ្រើសរើសធនាគារទូទាត់ (Choose Bank):
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* ABA Tab */}
                <button
                  type="button"
                  onClick={() => setSelectedBank("ABA")}
                  className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-sm transition cursor-pointer ${selectedBank === "ABA"
                      ? "border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 shadow-md ring-2 ring-sky-500"
                      : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50"
                    }`}
                >
                  <span className="h-6 w-6 rounded-full bg-[#004b87] text-white text-xs font-black flex items-center justify-center">
                    A
                  </span>
                  <span>ABA' Bank</span>
                </button>

                {/* ACLEDA Tab */}
                <button
                  type="button"
                  onClick={() => setSelectedBank("ACLEDA")}
                  className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-sm transition cursor-pointer ${selectedBank === "ACLEDA"
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 shadow-md ring-2 ring-blue-600"
                      : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50"
                    }`}
                >
                  <span className="h-6 w-6 rounded-full bg-[#0f2c59] text-white text-xs font-black flex items-center justify-center">
                    🦅
                  </span>
                  <span>អេស៊ីលីដា (ACLEDA)</span>
                </button>
              </div>
            </div>

            {/* Authentic KHQR Card */}
            <div className="mx-auto max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-white text-gray-900">
              {/* Bank Card Header */}
              {selectedBank === "ABA" ? (
                <div className="bg-[#004b87] text-white p-3.5 text-center font-black tracking-widest text-lg flex items-center justify-center gap-2">
                  <span>ABA' QR</span>
                </div>
              ) : (
                <div className="bg-[#0f2c59] text-white p-3.5 text-center font-black tracking-wider text-base flex items-center justify-center gap-2">
                  <span>🦅 អេស៊ីលីដា ACLEDA BANK</span>
                </div>
              )}

              {/* KHQR Red Tag */}
              <div className="bg-[#e31b23] text-white py-1.5 px-4 text-center font-black tracking-widest text-sm flex items-center justify-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white" />
                KHQR
              </div>

              {/* Account Holder Name */}
              <div className="p-4 text-center border-b border-dashed border-gray-200">
                <p className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                  ឈ្មោះគណនី (Account Name)
                </p>
                <p className="text-lg font-black text-gray-900 tracking-wide mt-0.5">
                  {selectedBank === "ABA" ? "VEASNA CHAN" : "CHAN VEASNA"}
                </p>
              </div>

              {/* QR Image with KHQR center badge */}
              <div className="p-4 flex flex-col items-center justify-center bg-white">
                <div className="relative p-2 bg-white rounded-2xl shadow-inner border border-gray-200">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=KHQR-${selectedBank}-VEASNA-CHAN-${totalPrice}`}
                    alt="KHQR Code"
                    className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                  />
                  {/* Center Emblem */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="h-10 w-10 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-white text-xs font-black shadow-md">
                      KH
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 text-center mt-3 font-medium">
                  ស្កេនទូទាត់ ជាមួយគ្រប់កម្មវិធីធនាគារ (Bakong, ABA, ACLEDA, Wing, Canadia...)
                </p>
              </div>

              {/* Account Numbers Information & Copy buttons */}
              <div className="bg-gray-50 p-4 border-t border-gray-200 space-y-2 text-xs">
                {selectedBank === "ABA" ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center gap-1">
                        <strong className="text-red-600">៛</strong> គណនី KHR:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-gray-900 text-sm">
                          008 463 546
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("008463546", "KHR")}
                          className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-[10px] cursor-pointer"
                        >
                          {copiedText === "KHR" ? "✓ បានចម្លង" : "ចម្លង"}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center gap-1">
                        <strong className="text-emerald-600">$</strong> គណនី USD:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-gray-900 text-sm">
                          500 270 502
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("500270502", "USD")}
                          className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-[10px] cursor-pointer"
                        >
                          {copiedText === "USD" ? "✓ បានចម្លង" : "ចម្លង"}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">គណនី ACLEDA:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-gray-900 text-sm">
                        CHAN VEASNA (KHQR)
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard("CHAN VEASNA", "ACLEDA")}
                        className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-[10px] cursor-pointer"
                      >
                        {copiedText === "ACLEDA" ? "✓ បានចម្លង" : "ចម្លង"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Optional Receipt Slip Checkbox */}
            <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center gap-3">
              <input
                type="checkbox"
                id="slip"
                checked={slipAttached}
                onChange={(e) => setSlipAttached(e.target.checked)}
                className="h-4 w-4 rounded text-red-600 focus:ring-red-500 cursor-pointer"
              />
              <label
                htmlFor="slip"
                className="text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer select-none"
              >
                ខ្ញុំបានផ្ទេរប្រាក់ចំនួន <strong className="text-red-600 dark:text-red-400">${totalPrice.toFixed(2)}</strong> តាម {selectedBank} រួចរាល់ហើយ
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep("details")}
                className="py-3 px-5 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-800 dark:text-gray-200 text-sm font-bold transition cursor-pointer"
              >
                ← កែសម្រួល
              </button>
              <button
                type="button"
                disabled={isVerifying}
                onClick={handleConfirmPayment}
                className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm sm:text-base font-black shadow-xl shadow-emerald-600/30 transition hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>កំពុងផ្ទៀងផ្ទាត់ការបង់ប្រាក់...</span>
                  </>
                ) : (
                  <>
                    <span>✅ បញ្ជាក់ការកក់សំបុត្រ (បានបង់ប្រាក់រួច)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Success Screen */}
        {step === "success" && (
          <div className="p-6 sm:p-8 text-center space-y-5 max-h-[78vh] overflow-y-auto">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-4xl text-emerald-600 dark:text-emerald-400 animate-bounce">
              ✓
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-2">
                ● បានទូទាត់ប្រាក់ជោគជ័យតាម {selectedBank} Bank KHQR
              </span>
              <h4 className="text-2xl font-black text-gray-900 dark:text-white">
                ការកក់សំបុត្របានជោគជ័យ ១០០%!
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                លេខកូដសំបុត្រផ្លូវការរបស់អ្នក (Booking Reference ID):
              </p>
              <div className="inline-block mt-2 px-6 py-2 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-2xl font-black text-red-600 dark:text-red-400 tracking-widest">
                {bookingRef}
              </div>
            </div>

            {/* Official e-Ticket Receipt */}
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-5 text-left text-xs sm:text-sm space-y-2.5 border border-gray-200 dark:border-gray-700 shadow-inner">
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="text-gray-500 dark:text-gray-400">ភាពយន្ត:</span>
                <span className="font-bold text-gray-900 dark:text-white text-right">
                  {movie.title} ({movie.tag})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">រោងភាពយន្ត:</span>
                <span className="font-semibold text-gray-900 dark:text-white text-right">
                  {selectedCinema}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">ប្រភេទសាល & ម៉ោង:</span>
                <span className="font-semibold text-gray-900 dark:text-white text-right">
                  {selectedFormat.name} | {selectedDate} ({selectedTime})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">កៅអីអង្គុយ:</span>
                <span className="font-bold text-red-600 dark:text-red-400">
                  {selectedSeats.join(", ")} ({selectedSeats.length} កៅអី)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">អ្នកកក់ & ទូរស័ព្ទ:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {customerName || "អតិថិជន"} ({customerPhone})
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2.5 text-base">
                <span className="font-bold text-gray-900 dark:text-white">
                  ទឹកប្រាក់បានទូទាត់:
                </span>
                <span className="font-black text-emerald-600 dark:text-emerald-400">
                  ${totalPrice.toFixed(2)} ({totalPriceKHR} ៛)
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs text-blue-700 dark:text-blue-300">
              📲 <strong>ការណែនាំ៖</strong> សូមថត Screenshot ឬបង្ហាញលេខកូដសំបុត្រ <strong>{bookingRef}</strong> នេះនៅបញ្ជរប្តូរសំបុត្ររោងភាពយន្តដើម្បីចូលទស្សនា។
            </div>

            <button
              onClick={resetAndClose}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-base shadow-lg shadow-red-600/30 hover:opacity-95 transition cursor-pointer"
            >
              រួចរាល់ (Done)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
