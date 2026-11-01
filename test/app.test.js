import test from "node:test";
import assert from "node:assert/strict";
import { calculateStreak, confirmHabitDeletion, localDateKey, toggleDate } from "../app.js";

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

test("confirmHabitDeletion includes the habit name and returns the choice", () => {
  let receivedMessage = "";
  const choice = confirmHabitDeletion("물 마시기", (message) => {
    receivedMessage = message;
    return false;
  });

  assert.equal(choice, false);
  assert.match(receivedMessage, /물 마시기/);
  assert.match(receivedMessage, /완료 기록/);
});
