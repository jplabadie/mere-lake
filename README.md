# Mere Lake

An open-source data lake and analytics project you can deploy on AWS. The layout is [Agentic Foundry](https://github.com/jplabadie/agentic-foundry): founding documents, a bedrock check, and CI that refuses a quiet drift.

Eight fictional orders land in a private S3 bucket. Glue catalogs them. Athena answers a daily revenue query. The same totals are checked locally, with no AWS account, by Node.

## Check it locally

Node 22. No install.

```bash
node scripts/analytics.mjs
node scripts/bedrock.mjs
node --test scripts/analytics.test.mjs
```

`analytics.mjs` prints the fixture totals: 8 orders, 5 paid, 13100 cents paid.

## Deploy on AWS

You need Terraform 1.9.8 and credentials that can create S3, Glue, Athena, and IAM. The default region is `us-east-1`.

```bash
cd infra/terraform
terraform init
terraform plan
terraform apply
```

Apply is a human step. CI validates the files and does not apply them.

When apply finishes, the outputs name the buckets, the workgroup, and the analyst role. In the Athena console, select the `mere` workgroup and run [`sql/orders_daily.sql`](sql/orders_daily.sql).

State is local in this starter. Before a second person applies, move the backend to an S3 bucket and a lock table. The block to uncomment is in `infra/terraform/versions.tf`.

## What the apply creates

| Piece | Behavior |
| --- | --- |
| Three S3 buckets | raw, curated, results. Public access blocked. SSE-S3. |
| Curated | Versioned. Reserved for a later transform. |
| Results | Athena output expires after 14 days. |
| Glue database `mere` | Table `orders` over the sample CSV. |
| Athena workgroup `mere` | Enforced. Results encrypted. |
| IAM role `mere-analyst` | Read the lake, query the workgroup. Not an admin. |

Destroy is also a human step: `terraform destroy` in `infra/terraform`.

## License

MIT.
