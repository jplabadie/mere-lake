# Team loop

### propose

An agent or a person opens a pull request. Infra changes say so in the body.

### review

A person reviews `contract` and `infra`. Applying Terraform is not part of review.

### apply

CI must be green: `bedrock`, `analytics`, and `terraform`. Merge does not apply the cloud. A person runs `terraform apply` after the merge.

### record

A contract change bumps `revision`. A dataset or a total that moved updates the fixtures in the same change.
