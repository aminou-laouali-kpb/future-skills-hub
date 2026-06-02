import { describe, expect, it, vi } from "vitest";
import { canSyncToSupabase } from "@/lib/userId";

vi.mock("@/lib/supabase", () => ({
  isSupabaseConfigured: true,
}));

describe("canSyncToSupabase", () => {
  it("rejects guest and mock users", () => {
    expect(canSyncToSupabase("guest")).toBe(false);
    expect(canSyncToSupabase("mock-abc")).toBe(false);
  });

  it("accepts uuid auth users", () => {
    expect(canSyncToSupabase("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")).toBe(true);
  });
});
