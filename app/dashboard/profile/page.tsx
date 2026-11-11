"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockCurrentUser } from "@/lib/data";
import { useToast } from "@/hooks/useToast";

export default function ProfilePage() {
  const { toast } = useToast();
  const { user, updateUserProfile } = useAuth();
  const currentUser = user || mockCurrentUser;

  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    if (!name.trim()) {
      errors.name = "សូមបញ្ចូលឈ្មោះរបស់អ្នក";
    }
    if (phone.trim()) {
      const cleanPhone = phone.replace(/[\s-]/g, "");
      if (!/^\d{8,11}$/.test(cleanPhone)) {
        errors.phone = "លេខទូរស័ព្ទត្រូវមានពី ៨ ទៅ ១១ ខ្ទង់";
      }
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    setSavedMessage("");
    setServerError("");

    const res = await updateUserProfile({ name, phone });
    setIsSubmitting(false);

    if (res.success) {
      const msg = res.message || "បានរក្សាទុកការផ្លាស់ប្តូរដោយជោគជ័យ!";
      setSavedMessage(msg);
      toast.success(msg);
      setTimeout(() => setSavedMessage(""), 3500);
    } else {
      const err = res.message || "មិនអាចរក្សាទុកការផ្លាស់ប្តូរបានទេ!";
      setServerError(err);
      toast.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          ព័ត៌មានផ្ទាល់ខ្លួន (User Profile)
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          គ្រប់គ្រងព័ត៌មានគណនី និងលេខទូរស័ព្ទរបស់អ្នក
        </p>
      </div>

      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        {serverError && (
          <div className="mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm font-bold text-red-600 dark:text-red-400 animate-fade-in">
            ⚠️ {serverError}
          </div>
        )}
        {savedMessage && (
          <div className="mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm font-bold text-emerald-600 dark:text-emerald-400 animate-fade-in">
            ✓ {savedMessage}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6" noValidate>
          <div className="flex items-center gap-6">
            <img
              src={currentUser.avatar || mockCurrentUser.avatar}
              alt={currentUser.name}
              className="h-20 w-20 rounded-3xl object-cover ring-4 ring-red-500/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-gray-900 dark:text-white">
                  {currentUser.name}
                </h4>
                <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-extrabold text-red-600 dark:text-red-400 uppercase">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-gray-500">{currentUser.email}</p>
              <button
                type="button"
                onClick={() =>
                  toast.info(
                    "មុខងារប្តូររូបតំណាង",
                    "មុខងារប្តូររូបភាព Profile នឹងបន្ថែមនាពេលឆាប់ៗនេះ។"
                  )
                }
                className="mt-2 text-xs font-bold text-red-600 hover:underline dark:text-red-400 cursor-pointer"
              >
                ប្តូររូបតំណាង (Change Avatar)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                ឈ្មោះពេញ (Full Name) *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) {
                    setFieldErrors((prev) => ({ ...prev, name: "" }));
                  }
                }}
                className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-red-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white ${
                  fieldErrors.name ? "border-red-500 bg-red-50/50" : "border-gray-300 bg-gray-50"
                }`}
              />
              {fieldErrors.name && (
                <p className="text-xs text-red-500">{fieldErrors.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                លេខទូរស័ព្ទ (Phone Number)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (fieldErrors.phone) {
                    setFieldErrors((prev) => ({ ...prev, phone: "" }));
                  }
                }}
                placeholder="012 345 678"
                className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-red-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white ${
                  fieldErrors.phone ? "border-red-500 bg-red-50/50" : "border-gray-300 bg-gray-50"
                }`}
              />
              {fieldErrors.phone && (
                <p className="text-xs text-red-500">{fieldErrors.phone}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              អ៊ីមែល (Email Address)
            </label>
            <input
              type="email"
              disabled
              value={currentUser.email}
              className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-red-600/20 transition hover:bg-red-700 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {isSubmitting && (
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              )}
              <span>រក្សាទុកការផ្លាស់ប្តូរ (Save Changes)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
