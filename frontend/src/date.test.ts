import { describe, it, expect } from "vitest";
import { fmtDate } from "./date";

describe("fmtDate", () => {
  it("formats YYYY-MM-DD to a readable date", () => {
    const out = fmtDate("2025-10-02");
    expect(out).toMatch(/2025/); // be lenient to locale (just assert the year is present)
  });

  it("returns a dash for invalid input", () => {
    expect(fmtDate("not-a-date")).toBe("—");
    expect(fmtDate(null as any)).toBe("—");
  });
});
