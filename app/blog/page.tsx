"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BlogPost } from "@/types";

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch("/api/posts");
        const json = await res.json();
        if (json.success) {
          setPosts(json.data);
        }
      } catch (e) {}
    }
    loadPosts();
  }, []);

  const categories = ["ALL", "ព័ត៌មានភាពយន្ត", "បច្ចេកវិទ្យារោងកុន", "Review"];

  const filteredPosts = posts.filter((p) => {
    const matchCat = selectedCategory === "ALL" || p.category === selectedCategory;
    const matchSearch =
      p.titleKh.toLowerCase().includes(search.toLowerCase()) ||
      p.titleEn.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-50 px-4 py-1 text-xs font-black uppercase tracking-widest text-red-600 dark:bg-red-500/10 dark:text-red-400">
            📰 SPIDER-SNA CINEMA BLOG
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white sm:text-5xl">
            ព័ត៌មានភាពយន្ត & បច្ចេកវិទ្យារោងកុន
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
            អត្ថបទវិភាគ Review ភាពយន្ត Spider-Man និងការអភិវឌ្ឍរោងកុន IMAX, ScreenX នៅកម្ពុជា
          </p>
        </div>

        {/* Search & Categories */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                  selectedCategory === cat
                    ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                    : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                {cat === "ALL" ? "ទាំងអស់" : cat}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="ស្វែងរកអត្ថបទ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-red-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm transition hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="relative h-60 w-full overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.titleKh}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 rounded-xl bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                  {post.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between p-6 sm:p-8 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    <span>📅 {post.publishedAt}</span>
                    <span>•</span>
                    <span>⏱️ {post.readTime}</span>
                  </div>

                  <h2 className="text-xl font-black text-gray-900 transition group-hover:text-red-600 dark:text-white dark:group-hover:text-red-400 sm:text-2xl leading-snug">
                    <Link href={`/blog/${post.slug}`}>{post.titleKh}</Link>
                  </h2>

                  <p className="text-sm text-gray-600 line-clamp-2 dark:text-gray-300">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      {post.author.name}
                    </span>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-bold text-red-600 hover:underline dark:text-red-400"
                  >
                    អានបន្ត →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
