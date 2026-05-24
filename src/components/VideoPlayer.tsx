import { useState } from "react";
import { Play, ExternalLink, Clock, Database } from "lucide-react";
import { useLiteMode } from "@/contexts/LiteModeContext";
import { useLanguage } from "@/i18n/LanguageContext";

interface VideoPlayerProps {
  videoId?: string;
  title: string;
  durationSec?: number;
  sizeMB?: number;
  transcript?: string;
}

function formatDuration(sec?: number) {
  if (!sec) return "";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoPlayer({ videoId, title, durationSec, sizeMB, transcript }: VideoPlayerProps) {
  const { isLite } = useLiteMode();
  const { lang } = useLanguage();
  const [playing, setPlaying] = useState(false);

  const isPlaceholder = !videoId || videoId === "PLACEHOLDER";
  const thumb = videoId && !isPlaceholder ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;

  if (isLite) {
    return (
      <div className="rounded-xl border bg-muted/30 p-4 my-4">
        <div className="flex items-center gap-2 text-sm font-medium mb-2">
          <Play className="h-4 w-4 text-primary" />
          {lang === "fr" ? "Vidéo (mode lite)" : "Video (lite mode)"}
        </div>
        <p className="text-sm text-muted-foreground mb-3">{title}</p>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
          {durationSec && <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{formatDuration(durationSec)}</span>}
          {sizeMB && <span className="inline-flex items-center gap-1"><Database className="h-3 w-3" />~{sizeMB} MB</span>}
        </div>
        {!isPlaceholder && (
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"
          >
            {lang === "fr" ? "Ouvrir sur YouTube" : "Open on YouTube"} <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {transcript && (
          <details className="mt-3">
            <summary className="text-sm font-medium cursor-pointer">{lang === "fr" ? "Transcription" : "Transcript"}</summary>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{transcript}</p>
          </details>
        )}
      </div>
    );
  }

  if (isPlaceholder) {
    return (
      <div className="aspect-video rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center my-4 text-center p-4">
        <Play className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-sm font-medium">{lang === "fr" ? "Vidéo à venir" : "Video coming soon"}</p>
        <p className="text-xs text-muted-foreground mt-1">{title}</p>
      </div>
    );
  }

  return (
    <div className="my-4">
      <div className="aspect-video rounded-xl overflow-hidden bg-black relative">
        {!playing ? (
          <button onClick={() => setPlaying(true)} className="group relative w-full h-full" aria-label={`Play ${title}`}>
            <img src={thumb!} alt={title} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 flex items-center justify-center transition-colors">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-elevated">
                <Play className="h-7 w-7 ml-1" fill="currentColor" />
              </div>
            </div>
          </button>
        ) : (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        )}
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
        {durationSec && <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{formatDuration(durationSec)}</span>}
        {sizeMB && <span className="inline-flex items-center gap-1"><Database className="h-3 w-3" />~{sizeMB} MB</span>}
      </div>
    </div>
  );
}
