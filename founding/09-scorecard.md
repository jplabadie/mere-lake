# Scorecard

| Grade | Rule |
| --- | --- |
| A | Every row passes |
| C | A non-critical row fails |
| F | A critical row fails |

| `law-invariants` | Law | yes | Invariants equal the manifest and the recorded hash |
| `ci-jobs` | CI | yes | The workflow has every required check and pins its actions |
| `protected-paths` | Change | yes | CODEOWNERS covers every protected path |
| `agent-charter` | Agents | yes | AGENTS.md names every phase and the manifest |
| `analytics-fixtures` | Analytics | yes | The sample totals equal the fixtures |
| `private-lake` | Infra | yes | Terraform blocks public access and encrypts |
