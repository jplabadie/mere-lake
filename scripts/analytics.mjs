import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

export function summarize(csv) {
  const lines = csv.trim().split(/\n/).slice(1).filter(Boolean);
  const rows = lines.map((line) => {
    const [orderId, region, amount, status, day] = line.split(",");
    return { orderId, region, amount: Number(amount), status, day };
  });
  const paid = rows.filter((row) => row.status === "paid");
  const refunded = rows.filter((row) => row.status === "refunded");
  const paidCentsByRegion = {};
  for (const row of paid) paidCentsByRegion[row.region] = (paidCentsByRegion[row.region] ?? 0) + row.amount;
  const ordered = Object.fromEntries(Object.keys(paidCentsByRegion).sort().map((key) => [key, paidCentsByRegion[key]]));
  return {
    orders: rows.length,
    paidOrders: paid.length,
    paidCents: paid.reduce((sum, row) => sum + row.amount, 0),
    refundedCents: refunded.reduce((sum, row) => sum + row.amount, 0),
    paidCentsByRegion: ordered,
  };
}

export function fixtureSummary() {
  return JSON.parse(readFileSync(join(root, "founding/fixtures.json"), "utf8")).analytics;
}

export function sampleSummary() {
  return summarize(readFileSync(join(root, "sample/orders.csv"), "utf8"));
}

if (process.argv[1] && import.meta.url.endsWith("analytics.mjs") && process.argv[1].endsWith("analytics.mjs")) {
  console.log(JSON.stringify(sampleSummary(), null, 2));
}
