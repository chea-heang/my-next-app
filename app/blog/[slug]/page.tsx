"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { mockBlogPosts } from "@/lib/data";
import { BlogPost } from "@/types";
import ArticleSkeleton from "@/components/skeletons/ArticleSkeleton";
import { useToast } from "@/hooks/useToast";

export default function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<
    { id: string; name: string; text: string; time: string }[]
  >([
    {
      id: "c1",
      name: "សុខ ចិន្តា",
      text: "IMAX Laser នៅ Aeon 3 ពិតជាច្បាស់ និងសំឡេងកក្រើកមែន!",
      time: "2 ម៉ោងមុន",
    },
  ]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const found = mockBlogPosts.find((p) => p.slug === resolvedParams.slug);
    if (found) {
      setPost(found);
    } else {
      fetch("/api/posts")
        .then((r) => r.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data)) {
            const dynamicFound = json.data.find(
              (p: BlogPost) => p.slug === resolvedParams.slug
            );
            if (dynamicFound) {
              setPost(dynamicFound);
              return;
            }
          }
          if (mockBlogPosts.length > 0) {
            setPost(mockBlogPosts[0]);
          }
        })
        .catch(() => {
          if (mockBlogPosts.length > 0) {
            setPost(mockBlogPosts[0]);
          }
        });
    }
  }, [resolvedParams.slug]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      {
        id: `c_${Date.now()}`,
        name: "អ្នកទស្សនា (Guest)",
        text: newComment,
        time: "ទើបតែបន្ថែម",
      },
    ]);
    setNewComment("");
    toast.success("បានបញ្ចេញមតិយោបល់ជោគជ័យ!", "សូមអរគុណសម្រាប់ការចែករំលែកមតិរបស់អ្នក។");
  };

  if (!post) {
    return <ArticleSkeleton />;
  }

  return (
    <article className="min-h-screen bg-white py-12 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-8">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold text-red-600 hover:underline dark:text-red-400"
        >
          ← ត្រឡប់ទៅកាន់បញ្ជីអត្ថបទ
        </Link>

        {/* Title & Metadata */}
        <div className="space-y-4">
          <span className="inline-block rounded-lg bg-red-100 px-3 py-1 text-xs font-bold text-red-600 dark:bg-red-950/50 dark:text-red-400">
            {post.category}
          </span>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white sm:text-5xl leading-tight">
            {post.titleKh}
          </h1>

          <div className="flex items-center gap-4 border-b border-gray-100 pb-6 dark:border-gray-800">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-red-500/20"
            />
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">
                {post.author.name}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {post.publishedAt} • អានប្រមាណ {post.readTime}
              </p>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="overflow-hidden rounded-3xl">
          <img
            src={post.coverImage}
            alt={post.titleKh}
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* Body Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed space-y-4 whitespace-pre-line">
          {post.content}
        </div>

        {/* Comments Section */}
        <div className="border-t border-gray-100 pt-10 dark:border-gray-800 space-y-6">
          <h3 className="text-xl font-black text-gray-900 dark:text-white">
            មតិយោបល់ ({comments.length})
          </h3>

          <form onSubmit={handleAddComment} className="space-y-3">
            <textarea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="បញ្ចេញមតិយោបល់របស់អ្នកនៅទីនេះ..."
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm outline-none transition focus:border-red-500 focus:bg-white dark:border-gray-800 dark:bg-gray-900 dark:text-white"
            />
            <button
              type="submit"
              className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-red-600/20 transition hover:bg-red-700"
            >
              ផ្ញើមតិ (Post Comment)
            </button>
          </form>

          <div className="space-y-4 pt-4">
            {comments.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-900/60"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {c.name}
                  </span>
                  <span className="text-gray-400">{c.time}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
