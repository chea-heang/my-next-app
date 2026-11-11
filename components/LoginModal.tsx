"use client";

import React, { useState, useEffect, useId } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/useToast";

export default function LoginModal() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    modalMode,
    setModalMode,
    login,
    register,
    quickLogin,
  } = useAuth();
  const { language: lang } = useLanguage();

  // Form states
  const [email, setEmail] = useState("veasna.chan@example.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);

  // Register specific fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Validation & status states
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);

  // Auto-open modal if URL query param has ?login=true & capture callbackUrl
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("login") === "true") {
        openLoginModal("login");
      }
      const cb = params.get("callbackUrl");
      if (cb) {
        setCallbackUrl(cb);
      }
    }
  }, [openLoginModal]);

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

  // Real-time Field Validation Helper
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "email":
        if (!value.trim()) return "សូមបញ្ចូលអ៊ីមែល (Email is required)";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "ទម្រង់អ៊ីមែលមិនត្រឹមត្រូវ (Invalid email format)";
        }
        return "";

      case "password":
        if (!value) return "សូមបញ្ចូលពាក្យសម្ងាត់ (Password is required)";
        if (value.length < 6) {
          return "ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ (Min 6 characters)";
        }
        return "";

      case "name":
        if (modalMode === "register") {
          if (!value.trim()) return "សូមបញ្ចូលឈ្មោះរបស់អ្នក (Full name required)";
          if (value.trim().length < 2) {
            return "ឈ្មោះត្រូវមានយ៉ាងតិច ២ តួអក្សរ";
          }
        }
        return "";

      case "confirmPassword":
        if (modalMode === "register") {
          if (!value) return "សូមបញ្ជាក់ពាក្យសម្ងាត់ (Confirm password required)";
          if (value !== password) {
            return "ពាក្យសម្ងាត់ផ្ទៀងផ្ទាត់មិនត្រូវគ្នាទេ (Passwords do not match)";
          }
        }
        return "";

      case "phone":
        if (modalMode === "register" && value.trim()) {
          const cleaned = value.replace(/[\s-]/g, "");
          if (!/^\d{8,11}$/.test(cleaned)) {
            return "លេខទូរស័ព្ទមិនត្រឹមត្រូវ (8-11 digits required)";
          }
        }
        return "";

      default:
        return "";
    }
  };

  const handleBlur = (field: string, val: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, val);
    setFieldErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleChange = (
    field: string,
    val: string,
    setter: (v: string) => void
  ) => {
    setter(val);
    if (serverError) setServerError("");
    if (touched[field]) {
      const err = validateField(field, val);
      setFieldErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const switchMode = (mode: "login" | "register") => {
    setServerError("");
    setSuccessMessage("");
    setFieldErrors({});
    setTouched({});
    setModalMode(mode);
  };

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");

    // Run full form validation
    const errors: Record<string, string> = {};
    errors.email = validateField("email", email);
    errors.password = validateField("password", password);

    if (modalMode === "register") {
      errors.name = validateField("name", name);
      errors.confirmPassword = validateField("confirmPassword", confirmPassword);
      if (phone) errors.phone = validateField("phone", phone);
    }

    const hasError = Object.values(errors).some((err) => Boolean(err));
    setFieldErrors(errors);
    setTouched({
      email: true,
      password: true,
      name: true,
      confirmPassword: true,
      phone: true,
    });

    if (hasError) return;

    setIsSubmitting(true);

    try {
      if (modalMode === "login") {
        const res = await login(email, password);
        setIsSubmitting(false);

        if (res.success) {
          const msg = res.message || "ចូលគណនីជោគជ័យ!";
          setSuccessMessage(msg);
          toast.success(msg, `សូមស្វាគមន៍មកកាន់ Veasna Cinema!`);
          setTimeout(() => {
            closeLoginModal();
            if (callbackUrl) {
              router.push(callbackUrl);
            }
          }, 600);
        } else {
          const errMsg = res.message || "Email ឬ Password មិនត្រឹមត្រូវ!";
          setServerError(errMsg);
          toast.error(errMsg);
        }
      } else {
        const res = await register({ name, email, phone, password });
        setIsSubmitting(false);

        if (res.success) {
          const msg = res.message || "ចុះឈ្មោះជោគជ័យ!";
          setSuccessMessage(msg);
          toast.success(msg, "គណនីរបស់អ្នកត្រូវបានបង្កើតដោយជោគជ័យ។");
          setTimeout(() => {
            closeLoginModal();
            if (callbackUrl) {
              router.push(callbackUrl);
            }
          }, 600);
        } else {
          const errMsg = res.message || "ការចុះឈ្មោះមិនបានសម្រេច!";
          setServerError(errMsg);
          toast.error(errMsg);
        }
      }
    } catch (err: unknown) {
      setIsSubmitting(false);
      const errMsg =
        err instanceof Error ? err.message : "មានបញ្ហានៅលើប្រព័ន្ធ សូមព្យាយាមម្តងទៀត";
      setServerError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleQuickLogin = async (role: "user" | "admin") => {
    setIsSubmitting(true);
    setServerError("");
    await quickLogin(role);
    setIsSubmitting(false);
    toast.info(
      `ចូលគណនី ${role === "admin" ? "Admin Demo" : "User Demo"} ជោគជ័យ!`,
      role === "admin" ? "អ្នកមានសិទ្ធិគ្រប់គ្រងកម្រិត Admin" : "អ្នកបានចូលជាសមាជិកទូទៅ"
    );
    if (callbackUrl) {
      router.push(callbackUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all animate-fade-in">
      {/* Backdrop click */}
      <div
        className="fixed inset-0"
        onClick={closeLoginModal}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md rounded-3xl border border-gray-200/80 bg-white/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl dark:border-gray-800 dark:bg-gray-900/95 transition-all z-10 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={closeLoginModal}
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition cursor-pointer"
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

        {/* Server Errors / Alerts */}
        {serverError && (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-50 p-3 text-center text-xs font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400 animate-shake">
            ⚠️ {serverError}
          </div>
        )}
        {successMessage && (
          <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-50 p-3 text-center text-xs font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            ✓ {successMessage}
          </div>
        )}

        {/* 1-Click Quick Demo Login Shortcuts */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleQuickLogin("user")}
            className="cursor-pointer rounded-xl border border-red-500/30 bg-linear-to-r from-red-50 to-rose-50 py-2 px-2 text-[11px] font-bold text-red-600 transition hover:bg-red-100 dark:from-red-950/40 dark:to-rose-950/30 dark:text-red-400 dark:hover:bg-red-900/50 text-center"
          >
            ⚡ User Demo Login
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleQuickLogin("admin")}
            className="cursor-pointer rounded-xl border border-purple-500/30 bg-linear-to-r from-purple-50 to-indigo-50 py-2 px-2 text-[11px] font-bold text-purple-700 transition hover:bg-purple-100 dark:from-purple-950/40 dark:to-indigo-950/30 dark:text-purple-300 dark:hover:bg-purple-900/50 text-center"
          >
            👑 Admin Demo Login
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5" noValidate>
          {modalMode === "register" && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  ឈ្មោះពេញ (Full Name) *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleChange("name", e.target.value, setName)}
                  onBlur={() => handleBlur("name", name)}
                  placeholder="ឧ. សុខ វាសនា"
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 outline-none transition dark:text-white dark:focus:bg-gray-900 ${
                    fieldErrors.name
                      ? "border-red-500 bg-red-50/50 dark:border-red-500 dark:bg-red-950/20"
                      : "border-gray-300 bg-gray-50 focus:border-red-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800"
                  }`}
                />
                {fieldErrors.name && (
                  <p className="text-[11px] font-medium text-red-500">{fieldErrors.name}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  លេខទូរស័ព្ទ (Phone Number)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => handleChange("phone", e.target.value, setPhone)}
                  onBlur={() => handleBlur("phone", phone)}
                  placeholder="012 345 678"
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 outline-none transition dark:text-white dark:focus:bg-gray-900 ${
                    fieldErrors.phone
                      ? "border-red-500 bg-red-50/50 dark:border-red-500 dark:bg-red-950/20"
                      : "border-gray-300 bg-gray-50 focus:border-red-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800"
                  }`}
                />
                {fieldErrors.phone && (
                  <p className="text-[11px] font-medium text-red-500">{fieldErrors.phone}</p>
                )}
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              អ៊ីមែល (Email) *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => handleChange("email", e.target.value, setEmail)}
              onBlur={() => handleBlur("email", email)}
              placeholder="name@example.com"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 outline-none transition dark:text-white dark:focus:bg-gray-900 ${
                fieldErrors.email
                  ? "border-red-500 bg-red-50/50 dark:border-red-500 dark:bg-red-950/20"
                  : "border-gray-300 bg-gray-50 focus:border-red-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800"
              }`}
            />
            {fieldErrors.email && (
              <p className="text-[11px] font-medium text-red-500">{fieldErrors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                ពាក្យសម្ងាត់ (Password) *
              </label>
              {modalMode === "login" && (
                <button
                  type="button"
                  onClick={() =>
                    toast.info(
                      "ព័ត៌មានជំនួយ Demo Login",
                      "សូមប្រើប្រាស់ Demo Login ឬ Email: veasna.chan@example.com / Password: password123"
                    )
                  }
                  className="text-[11px] font-semibold text-red-600 hover:underline dark:text-red-400 cursor-pointer"
                >
                  {lang === "KH" ? "ភ្លេចលេខសម្ងាត់?" : "Forgot password?"}
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => handleChange("password", e.target.value, setPassword)}
                onBlur={() => handleBlur("password", password)}
                placeholder="••••••••"
                className={`w-full rounded-xl border px-3.5 py-2.5 pr-10 text-sm text-gray-900 outline-none transition dark:text-white dark:focus:bg-gray-900 ${
                  fieldErrors.password
                    ? "border-red-500 bg-red-50/50 dark:border-red-500 dark:bg-red-950/20"
                    : "border-gray-300 bg-gray-50 focus:border-red-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs cursor-pointer"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-[11px] font-medium text-red-500">{fieldErrors.password}</p>
            )}
          </div>

          {modalMode === "register" && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                បញ្ជាក់ពាក្យសម្ងាត់ (Confirm Password) *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value, setConfirmPassword)
                }
                onBlur={() => handleBlur("confirmPassword", confirmPassword)}
                placeholder="••••••••"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 outline-none transition dark:text-white dark:focus:bg-gray-900 ${
                  fieldErrors.confirmPassword
                    ? "border-red-500 bg-red-50/50 dark:border-red-500 dark:bg-red-950/20"
                    : "border-gray-300 bg-gray-50 focus:border-red-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800"
                }`}
              />
              {fieldErrors.confirmPassword && (
                <p className="text-[11px] font-medium text-red-500">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer rounded-xl bg-linear-to-r from-red-600 to-rose-600 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition hover:opacity-95 active:scale-[0.99] disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>{lang === "KH" ? "កំពុងដំណើរការ..." : "Processing..."}</span>
              </>
            ) : modalMode === "login" ? (
              lang === "KH" ? (
                "ចូលគណនី (Sign In)"
              ) : (
                "Sign In"
              )
            ) : lang === "KH" ? (
              "ចុះឈ្មោះ (Create Account)"
            ) : (
              "Create Account"
            )}
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
            onClick={() => handleQuickLogin("user")}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
          >
            <span>🌐</span>
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin("user")}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
          >
            <span className="text-blue-600">📘</span>
            <span>Facebook</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin("user")}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
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
