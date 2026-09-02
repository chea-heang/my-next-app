"use client";

import { useEffect, useState } from "react";
import { mockCurrentUser } from "@/lib/data";
import { User } from "@/types";

export default function ProfilePage() {
  const [user, setUser] = useState<User>(mockCurrentUser);
  const [name, setName] = useState(mockCurrentUser.name);
  const [phone, setPhone] = useState(mockCurrentUser.phone || "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        setUser(parsed);
        setName(parsed.name);
        setPhone(parsed.phone || "");
      } catch (e) {}
    }
  }, []);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...user, name, phone };
    setUser(updated);
    localStorage.setItem("user_session", JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
        {saved && (
          <div className="mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm font-bold text-emerald-600 dark:text-emerald-400">
            ✓ បានរក្សាទុកការផ្លាស់ប្តូរដោយជោគជ័យ!
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="flex items-center gap-6">
            <img
              src={user.avatar || mockCurrentUser.avatar}
              alt={user.name}
              className="h-20 w-20 rounded-3xl object-cover ring-4 ring-red-500/20"
            />
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">{user.name}</h4>
              <p className="text-xs text-gray-500">{user.email}</p>
              <button
                type="button"
                onClick={() => alert("មុខងារប្តូររូបភាពនឹងបន្ថែមនាពេលខាងមុខ")}
                className="mt-2 text-xs font-bold text-red-600 hover:underline dark:text-red-400"
              >
                ប្តូររូបតំណាង (Change Avatar)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                ឈ្មោះពេញ (Full Name)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-red-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                លេខទូរស័ព្ទ (Phone Number)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="012 345 678"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-red-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              អ៊ីមែល (Email Address)
            </label>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-red-600/20 transition hover:bg-red-700 active:scale-95"
            >
              រក្សាទុកការផ្លាស់ប្តូរ (Save Changes)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
