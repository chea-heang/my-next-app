"use client";

import React, { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface VideoTrailer {
  id: string;
  titleKh: string;
  titleEn: string;
  year: string;
  youtubeId: string;
  directVideoUrl?: string;
  poster: string;
  tag: string;
  duration: string;
  badgeColor: string;
  description: string;
}

const trailers: VideoTrailer[] = [
  {
    id: "nowayhome",
    titleKh: "Spider-Man: No Way Home (វគ្គ ៦)",
    titleEn: "Spider-Man: No Way Home Official Trailer",
    year: "2021",
    youtubeId: "rt-2cxAiPJk",
    directVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=1200&q=80",
    tag: "IMAX Laser 4K",
    duration: "03:04",
    badgeColor: "bg-red-600",
    description: "ការជួបគ្នានៃ Spider-Man ទាំង ៣ ជំនាន់ ឆ្លងកាត់ច្រកទ្វារ Multiverse",
  },
  {
    id: "spiderverse",
    titleKh: "Across The Spider-Verse (ពហុសកល)",
    titleEn: "Across The Spider-Verse Official Trailer",
    year: "2023",
    youtubeId: "shW9i6k8cB0",
    directVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80",
    tag: "ScreenX 270°",
    duration: "02:38",
    badgeColor: "bg-purple-600",
    description: "ដំណើរផ្សងព្រេងរបស់ Miles Morales ក្នុងពិភពពហុសកលគ្មានដែនកំណត់",
  },
  {
    id: "spiderman1",
    titleKh: "Spider-Man 1 (វគ្គ ១ : ដើមកំណើត)",
    titleEn: "Classic Spider-Man 1 Remastered",
    year: "2002",
    youtubeId: "t06RUxPbp_c",
    directVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?auto=format&fit=crop&w=1200&q=80",
    tag: "Classic 4K",
    duration: "02:25",
    badgeColor: "bg-blue-600",
    description: "ដើមកំណើតនៃ Peter Parker និងការប្រយុទ្ធជាមួយ Green Goblin",
  },
  {
    id: "amazing",
    titleKh: "The Amazing Spider-Man (វគ្គ ៤)",
    titleEn: "The Amazing Spider-Man Trailer",
    year: "2012",
    youtubeId: "2RjX9q73p7M",
    directVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=1200&q=80",
    tag: "3D RealD",
    duration: "02:45",
    badgeColor: "bg-amber-600",
    description: "ដំណើរស្វែងរកការពិត និងការប៉ះទង្គិចជាមួយ The Lizard",
  },
  {
    id: "spiderman3",
    titleKh: "Spider-Man 3 (វគ្គ ៣ : Black Suit)",
    titleEn: "Spider-Man 3 Venom Battle",
    year: "2007",
    youtubeId: "wXZqDoxLqXg",
    directVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    tag: "Dolby Atmos",
    duration: "02:50",
    badgeColor: "bg-indigo-600",
    description: "ឈុតខ្មៅ Symbiote និងការប្រយុទ្ធធំរវាង Venom & Sandman",
  },
];

export default function HeroVideoPlayer() {
  const { language } = useLanguage();
  const [activeTrailer, setActiveTrailer] = useState<VideoTrailer>(trailers[0]);
  const [playerMode, setPlayerMode] = useState<"youtube" | "html5">("youtube");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-6 mb-4">
      {/* Outer Card Container */}
      <div className="relative rounded-3xl overflow-hidden bg-gray-950/95 border border-gray-800 shadow-2xl shadow-red-600/10 p-3 sm:p-4 backdrop-blur-xl">
        {/* Top Control & Status Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 bg-gray-900/90 rounded-2xl mb-3 border border-gray-800">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
              <span>🎬</span> <strong>{language === "KH" ? "កំពុងចាក់៖" : "Now Playing:"}</strong>{" "}
              <span className="text-red-400">{language === "KH" ? activeTrailer.titleKh : activeTrailer.titleEn}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Player Mode Switcher */}
            <div className="flex rounded-xl bg-gray-950 p-1 border border-gray-800">
              <button
                type="button"
                onClick={() => setPlayerMode("youtube")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                  playerMode === "youtube"
                    ? "bg-red-600 text-white shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                YouTube 4K
              </button>
              <button
                type="button"
                onClick={() => setPlayerMode("html5")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                  playerMode === "html5"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                HD Web Player
              </button>
            </div>

            <span
              className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold text-white ${activeTrailer.badgeColor}`}
            >
              {activeTrailer.tag}
            </span>
          </div>
        </div>

        {/* Video Player Display */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-gray-800/80 group">
          {playerMode === "youtube" ? (
            <iframe
              key={`yt-${activeTrailer.id}`}
              src={`https://www.youtube.com/embed/${activeTrailer.youtubeId}?autoplay=1&mute=0&rel=0&modestbranding=1&controls=1&showinfo=0`}
              title={activeTrailer.titleEn}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                key={`vid-${activeTrailer.id}`}
                src={activeTrailer.directVideoUrl}
                poster={activeTrailer.poster}
                autoPlay
                playsInline
                controls
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Quick Info Overlay on hover for YouTube mode */}
          <div className="absolute top-3 left-3 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300">
            <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-bold border border-white/10">
              {activeTrailer.description}
            </span>
          </div>
        </div>

        {/* Trailer Selector Tabs */}
        <div className="pt-3.5 pb-1">
          <div className="flex items-center justify-between mb-2.5 px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
              <span>📽️</span> {language === "KH" ? "ជ្រើសរើសវីដេអូ Trailer តាមវគ្គ (Select Movie Trailer):" : "Select Movie Trailer:"}
            </span>
            <span className="text-[11px] font-semibold text-gray-500">
              {language === "KH" ? "គុណភាពច្បាស់ Ultra HD 4K" : "Ultra HD 4K Quality"}
            </span>
          </div>

          {/* Grid of Trailer Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {trailers.map((t) => {
              const isCurrent = activeTrailer.id === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setActiveTrailer(t);
                    setIsPlaying(true);
                  }}
                  className={`p-2.5 rounded-2xl text-left text-xs transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                    isCurrent
                      ? "bg-gradient-to-r from-red-600 via-rose-600 to-indigo-600 text-white font-bold shadow-xl shadow-red-600/30 scale-[1.02] ring-2 ring-red-400"
                      : "bg-gray-900/90 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[10px] uppercase font-bold opacity-80">
                      {t.year}
                    </span>
                    <span className="text-xs">
                      {isCurrent ? "▶️" : "🎬"}
                    </span>
                  </div>
                  <span className="line-clamp-1 font-bold text-xs">
                    {language === "KH" ? t.titleKh.split("(")[0] : t.titleEn.split(" ").slice(0, 4).join(" ")}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1 flex justify-between">
                    <span>{t.tag}</span>
                    <span>{t.duration}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
