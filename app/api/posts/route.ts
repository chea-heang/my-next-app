import { NextResponse } from "next/server";
import { mockBlogPosts } from "@/lib/data";

let posts = [...mockBlogPosts];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: posts,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newPost = {
      id: `post_${Date.now()}`,
      slug: body.slug || `post-${Date.now()}`,
      titleKh: body.titleKh,
      titleEn: body.titleEn,
      excerpt: body.excerpt,
      content: body.content,
      coverImage: body.coverImage || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
      category: body.category || "ព័ត៌មានភាពយន្ត",
      author: {
        name: "Admin",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        role: "Content Creator",
      },
      publishedAt: new Date().toISOString().split("T")[0],
      readTime: "៣ នាទី",
      likes: 0,
      commentsCount: 0,
    };

    posts = [newPost, ...posts];

    return NextResponse.json({
      success: true,
      message: "បានបង្កើតអត្ថបទថ្មីជោគជ័យ!",
      data: newPost,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "មិនអាចបង្កើតអត្ថបទបានទេ" },
      { status: 400 }
    );
  }
}
