import assert from "node:assert/strict";
import { test } from "node:test";
import { fixtureSummary, sampleSummary } from "./analytics.mjs";

test("the sample matches the founding totals", () => {
  assert.deepEqual(sampleSummary(), fixtureSummary());
});
