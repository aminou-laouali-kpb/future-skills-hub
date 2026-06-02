import type { Lesson } from "@/data/mockData";

const CACHE_PREFIX = "fs-lesson-cache-";

type CachedLessonPayload = {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  order: number;
  duration: string;
  transcript?: string;
  videoId?: string;
  videoDurationSec?: number;
  videoSizeMB?: number;
  cachedAt: string;
};

export function cacheLesson(lesson: Lesson) {
  try {
    const payload: CachedLessonPayload = {
      id: lesson.id,
      moduleId: lesson.moduleId,
      title: lesson.title,
      content: lesson.content,
      order: lesson.order,
      duration: lesson.duration,
      transcript: lesson.transcript,
      videoId: lesson.videoId,
      videoDurationSec: lesson.videoDurationSec,
      videoSizeMB: lesson.videoSizeMB,
      cachedAt: new Date().toISOString(),
    };
    localStorage.setItem(`${CACHE_PREFIX}${lesson.id}`, JSON.stringify(payload));
  } catch {
    /* quota */
  }
}

export function getCachedLesson(lessonId: string): Lesson | null {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${lessonId}`);
    if (!raw) return null;
    const data = JSON.parse(raw) as CachedLessonPayload;
    return {
      id: data.id,
      moduleId: data.moduleId,
      title: data.title,
      content: data.content,
      order: data.order,
      completed: false,
      duration: data.duration ?? "",
      transcript: data.transcript,
      videoId: data.videoId,
      videoDurationSec: data.videoDurationSec,
      videoSizeMB: data.videoSizeMB,
    };
  } catch {
    return null;
  }
}

export function listCachedLessonIds(): string[] {
  const ids: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) ids.push(key.replace(CACHE_PREFIX, ""));
  }
  return ids;
}
