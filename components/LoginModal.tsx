"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LoginModal() {
  const {
    isLoginModalOpen,
    closeLoginModal,
    modalMode,
    setModalMode,
    login,
    register,
    quickLogin,
  } = useAuth();
  const { language: lang } = useLanguage();

  const [email, setEmail] = useState("veasna.chan@example.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);

  // Register fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isLoginModalOpen) {
        closeLoginModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLoginModalOpen, closeLoginModal]);

  const switchMode = (mode: "login" | "register") => {
    setErrorMessage("");
    setSuccessMessage("");
    setModalMode(mode);
  };

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    if (modalMode === "login") {
      const res = await login(email, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.message || "Email ឬ Password មិនត្រឹមត្រូវ!");
      }
    } else {
      if (!name.trim()) {
        setErrorMessage("សូមបញ្ចូលឈ្មោះរបស់អ្នក!");
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("ពាក្យសម្ងាត់ផ្ទៀងផ្ទាត់មិនត្រូវគ្នាទេ!");
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        setErrorMessage("ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ!");
        setIsLoading(false);
        return;
      }

      const res = await register({ name, email, phone, password });
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.message || "ការចុះឈ្មោះមិនបានសម្រេច!");
      }
    }
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setErrorMessage("");
    if (provider) {
      setTimeout(() => {
        quickLogin();
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all animate-fadeIn">
      {/* Backdrop click */}
      <div
        className="fixed inset-0"
        onClick={closeLoginModal}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md rounded-3xl border border-gray-200/80 bg-white/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl dark:border-gray-800 dark:bg-gray-900/95 transition-all z-10 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={closeLoginModal}
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Header with Icon */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-tr from-red-600 to-rose-500 text-2xl text-white shadow-lg shadow-red-500/30">
            🕷️
          </div>
          <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
            {modalMode === "login"
              ? lang === "KH"
                ? "ចូលគណនី"
                : "Sign In"
              : lang === "KH"
              ? "បង្កើតគណនីថ្មី"
              : "Create Account"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {lang === "KH"
              ? "គ្រប់គ្រងសំបុត្រកុន ទទួលបានពិន្ទុ និងការបញ្ចុះតម្លៃ VIP"
              : "Manage tickets, earn rewards, and get VIP discounts"}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="mt-5 grid grid-cols-2 rounded-2xl bg-gray-100 p-1 dark:bg-gray-800/80">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`cursor-pointer rounded-xl py-2 text-xs font-bold transition ${
              modalMode === "login"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            {lang === "KH" ? "ចូលគណនី (Login)" : "Sign In"}
          </button>
          <button
            type="button"
            onClick={() => switchMode("register")}
            className={`cursor-pointer rounded-xl py-2 text-xs font-bold transition ${
              modalMode === "register"
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            {lang === "KH" ? "ចុះឈ្មោះ (Register)" : "Register"}
          </button>
        </div>

        {/* Notifications / Errors */}
        {errorMessage && (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-50 p-3 text-center text-xs font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400 animate-shake">
            ⚠️ {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-50 p-3 text-center text-xs font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            ✓ {successMessage}
          </div>
        )}

        {/* 1-Click Quick Demo Login */}
        <div className="mt-4">
          <button
            type="button"
            onClick={quickLogin}
            className="w-full cursor-pointer rounded-xl border border-red-500/30 bg-linear-to-r from-red-50 to-rose-50 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100 dark:from-red-950/40 dark:to-rose-950/30 dark:text-red-400 dark:hover:bg-red-900/50"
          >
            ⚡ ចូលភ្លាមៗដោយមិនបាច់វាយ (1-Click Demo Login)
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {modalMode === "register" && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  ឈ្មោះពេញ (Full Name) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ឧ. សុខ វាសនា"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  លេខទូរស័ព្ទ (Phone)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="012 345 678"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              អ៊ីមែល (Email) *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                ពាក្យសម្ងាត់ (Password) *
              </label>
              {modalMode === "login" && (
                <button
                  type="button"
                  onClick={() => alert("សូមប្រើប្រាស់ '1-Click Demo Login' ឬ email: veasna.chan@example.com / password: password123")}
                  className="text-[11px] font-semibold text-red-600 hover:underline dark:text-red-400"
                >
                  {lang === "KH" ? "ភ្លេចលេខសម្ងាត់?" : "Forgot password?"}
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 pr-10 text-sm text-gray-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {modalMode === "register" && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                បញ្ជាក់ពាក្យសម្ងាត់ (Confirm Password) *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer rounded-xl bg-linear-to-r from-red-600 to-rose-600 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition hover:opacity-95 active:scale-[0.99] disabled:opacity-50 mt-2"
          >
            {isLoading
              ? lang === "KH"
                ? "កំពុងដំណើរការ..."
                : "Processing..."
              : modalMode === "login"
              ? lang === "KH"
                ? "ចូលគណនី (Sign In)"
                : "Sign In"
              : lang === "KH"
              ? "ចុះឈ្មោះ (Create Account)"
              : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800" />
          </div>
          <span className="relative bg-white px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:bg-gray-900">
            {lang === "KH" ? "ឬចូលតាមរយៈ" : "OR CONTINUE WITH"}
          </span>
        </div>

        {/* Social Demo Logins */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleSocialLogin("Google")}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-750 cursor-pointer"
          >
            <span>🌐</span>
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin("Facebook")}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-750 cursor-pointer"
          >
            <span className="text-blue-600">📘</span>
            <span>Facebook</span>
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin("Telegram")}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-750 cursor-pointer"
          >
            <span className="text-sky-500">✈️</span>
            <span>Telegram</span>
          </button>
        </div>

        {/* Footer switch */}
        <p className="mt-5 text-center text-xs text-gray-500 dark:text-gray-400">
          {modalMode === "login" ? (
            <>
              {lang === "KH" ? "មិនទាន់មានគណនីមែនទេ?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => switchMode("register")}
                className="font-bold text-red-600 hover:underline dark:text-red-400 cursor-pointer"
              >
                {lang === "KH" ? "ចុះឈ្មោះឥឡូវនេះ" : "Sign Up now"}
              </button>
            </>
          ) : (
            <>
              {lang === "KH" ? "មានគណនីរួចហើយ?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="font-bold text-red-600 hover:underline dark:text-red-400 cursor-pointer"
              >
                {lang === "KH" ? "ចូលគណនី" : "Sign In"}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
