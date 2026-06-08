'use client';

import React, { useState } from 'react';
import { Play, Volume2, VolumeX, Maximize2, Youtube } from 'lucide-react';

interface ExerciseVideoPlayerProps {
  videoId: string;
  exerciseName: string;
  thumbnailUrl?: string;
}

export function ExerciseVideoPlayer({ videoId, exerciseName, thumbnailUrl }: ExerciseVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Construct YouTube embed URL with autoplay and mute based on state
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${videoId}&controls=1&rel=0&modestbranding=1&playsinline=1`;

  // YouTube thumbnail fallback
  const thumbSrc = thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-[#080c15] group">
      {!isPlaying ? (
        /* ── Thumbnail + Play overlay ── */
        <div className="relative w-full h-full cursor-pointer" onClick={() => setIsPlaying(true)}>
          {/* Thumbnail image */}
          <img
            src={thumbSrc}
            alt={`${exerciseName} tutorial thumbnail`}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to hqdefault if maxresdefault doesn't exist
              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Neon glow ring behind button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              {/* Outer pulse ring */}
              <span className="absolute w-24 h-24 rounded-full bg-accent/20 animate-ping" />
              {/* Play button */}
              <button
                className="relative z-10 w-16 h-16 rounded-full bg-accent/90 hover:bg-accent flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all duration-300 hover:scale-110"
                aria-label={`Play ${exerciseName} tutorial`}
              >
                <Play className="w-7 h-7 text-white fill-white ml-1" />
              </button>
            </div>
          </div>

          {/* YouTube badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-white/10 rounded px-2 py-1">
            <Youtube className="w-3.5 h-3.5 text-red-500" />
            <span className="text-[10px] font-semibold text-white/80 tracking-wide">YouTube Tutorial</span>
          </div>

          {/* Exercise name badge at bottom */}
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-xs font-bold text-white/90 tracking-wide drop-shadow">{exerciseName}</p>
            <p className="text-[10px] text-white/50 mt-0.5">Click to play tutorial video</p>
          </div>
        </div>
      ) : (
        /* ── YouTube iframe embed ── */
        <div className="relative w-full h-full">
          <iframe
            src={embedUrl}
            title={`${exerciseName} exercise tutorial`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          {/* Controls overlay (top bar) */}
          <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
            {/* Mute toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="bg-black/60 backdrop-blur-md border border-white/10 rounded p-1.5 text-white/70 hover:text-white hover:bg-black/80 transition-all"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Fullscreen / Restart */}
            <button
              onClick={() => setIsPlaying(false)}
              className="bg-black/60 backdrop-blur-md border border-white/10 rounded p-1.5 text-white/70 hover:text-white hover:bg-black/80 transition-all"
              title="Close video"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Live indicator badge */}
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-[10px] text-white/60 border border-white/10 px-2 py-1 rounded font-mono pointer-events-none flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            YouTube • HD Tutorial
          </div>
        </div>
      )}
    </div>
  );
}
