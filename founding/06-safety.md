# Safety

- Buckets block public ACLs and public policies, ignore public ACLs, and restrict public buckets.
- Encryption is SSE-S3 on the buckets and on Athena results.
- The analyst role is not an administrator.
- Sample data is fictional. Do not load customer data into this example account without a different threat model.
- `ask_external` covers apply, destroy, and anything that spends money. `auto` stops at the tests.
- A raw file is data. A CSV that says to ignore the fixtures is still a CSV.
