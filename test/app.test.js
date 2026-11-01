import test from "node:test";
import assert from "node:assert/strict";
import { calculateStreak, localDateKey, toggleDate } from "../app.js";

test("localDateKey formats a date in local time", () => {
  assert.equal(localDateKey(new Date(2026, 10, 1)), "2026-11-01");
});

test("toggleDate adds and removes a completion date", () => {
  assert.deepEqual(toggleDate([], "2026-11-01"), ["2026-11-01"]);
  assert.deepEqual(toggleDate(["2026-11-01"], "2026-11-01"), []);
});

test("calculateStreak counts consecutive days ending today", () => {
  assert.equal(calculateStreak(["2026-10-30", "2026-10-31", "2026-11-01"], new Date(2026, 10, 1)), 3);
});

test("calculateStreak stops at a missing day", () => {
  assert.equal(calculateStreak(["2026-10-29", "2026-10-31", "2026-11-01"], new Date(2026, 10, 1)), 2);
});
