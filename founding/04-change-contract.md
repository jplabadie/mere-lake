# Change contract

| Class | Mere examples | Who approves |
| --- | --- | --- |
| `docs` | A clearer deploy sentence | review |
| `contract` | A new dataset, a new layer, a changed total | a person, not the author |
| `runtime` | The local summary, still matching the fixtures | review |
| `infra` | Buckets, Glue, Athena, IAM | a person, then `terraform apply` |

Protected paths include `infra/`. An agent does not merge an infrastructure change alone.
