"use client";

import { useRef, useEffect } from "react";

interface VoiceOutputProps {
  audioUrl?: string;
  autoPlay?: boolean;
  onEnd?: () => void;
}

export default function VoiceOutput({ audioUrl, autoPlay = true, onEnd }: VoiceOutputProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioUrl && autoPlay && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Autoplay may be blocked by browser
      });
    }
  }, [audioUrl, autoPlay]);

  if (!audioUrl) return null;

  return (
    <audio
      ref={audioRef}
      src={audioUrl}
      onEnded={onEnd}
      className="hidden"
    />
  );
}
