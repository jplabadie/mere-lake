# Architecture

| Layer | What it is | Where it lives |
| --- | --- | --- |
| Law | Manifest, fixtures, rubric | `founding/` |
| Local check | The same totals, no cloud | `scripts/analytics.mjs` |
| Lake | Private S3, Glue catalog, Athena | `infra/terraform/` |
| Query | Daily paid revenue | `sql/orders_daily.sql` |

Raw holds the CSV. The Glue table `mere.orders` describes it. Athena runs in the `mere` workgroup and writes results to the results bucket, encrypted, with a 14-day expiry. Curated is versioned and empty until a later transform writes there. This revision does not pretend a transform exists.

Nothing in the lake is public. The analyst role can read the lake and run the workgroup. It cannot administer IAM.
