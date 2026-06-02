import { describe, expect, it } from "vitest";
import { mergeProgressData } from "@/services/progressMerge";

describe("mergeProgressData", () => {
  it("unions lesson ids and keeps max quiz scores", () => {
    const merged = mergeProgressData(
      { completedLessonIds: ["m1-l1"], quizBestByModule: { m1: 50 } },
      { completedLessonIds: ["m1-l2"], quizBestByModule: { m1: 70, m2: 40 } }
    );
    expect(merged.completedLessonIds.sort()).toEqual(["m1-l1", "m1-l2"]);
    expect(merged.quizBestByModule.m1).toBe(70);
    expect(merged.quizBestByModule.m2).toBe(40);
  });
});
