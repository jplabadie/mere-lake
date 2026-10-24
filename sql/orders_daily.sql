-- Daily paid revenue. Raw rows are not facts until this query runs.
-- Database and table come from founding/manifest.json: mere.orders
SELECT
  day,
  region,
  COUNT(*) AS paid_orders,
  SUM(amount_cents) AS paid_cents
FROM mere.orders
WHERE status = 'paid'
GROUP BY day, region
ORDER BY day, region;
