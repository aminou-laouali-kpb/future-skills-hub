import { describe, expect, it } from "vitest";
import { loadMentoringRegistrations, applyMentoringState } from "@/services/mentoringService";

const USER = "test-mentoring-sync";

describe("mentoring local state", () => {
  it("applies hydrated registration ids", () => {
    localStorage.removeItem(`fs-mentoring-${USER}`);
    applyMentoringState(USER, {
      registeredSessionIds: ["s1", "s2"],
      spotsBySession: { s1: 4, s2: 0, s3: 0 },
    });
    const state = loadMentoringRegistrations(USER);
    expect(state.registeredSessionIds).toEqual(["s1", "s2"]);
    expect(state.spotsBySession.s1).toBe(4);
  });
});
