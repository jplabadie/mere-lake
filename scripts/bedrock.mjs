import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { sampleSummary } from "./analytics.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(join(root, path), "utf8");

export function extractInvariants(markdown) {
  const section = markdown.split("## Invariants")[1]?.split(/\n## /)[0] ?? "";
  return section.split("\n").map((line) => line.trim()).filter((line) => line && !line.startsWith("#"));
}

export function parseRubric(markdown) {
  const rows = [];
  const pattern = /^\|\s*`([a-z0-9-]+)`\s*\|\s*([^|]+?)\s*\|\s*(yes|no)\s*\|/gm;
  for (const match of markdown.matchAll(pattern)) {
    rows.push({ id: match[1], aspect: match[2].trim(), critical: match[3] === "yes" });
  }
  return rows;
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

export function runBedrock() {
  const failures = [];
  const fail = (message) => failures.push(message);
  const manifest = JSON.parse(read("founding/manifest.json"));
  const fixtures = JSON.parse(read("founding/fixtures.json"));
  const principles = read("founding/01-principles.md");
  const invariants = extractInvariants(principles);
  const rubric = parseRubric(read("founding/09-scorecard.md"));
  const checks = {
    "law-invariants"() {
      if (invariants.join("\n") !== manifest.invariants.join("\n")) {
        fail("invariants in 01-principles.md are not the manifest");
      }
      const hash = sha256(invariants.join("\n"));
      if (hash !== fixtures.invariantSha256) fail(`invariant hash is ${hash}, fixture says ${fixtures.invariantSha256}`);
    },
    "ci-jobs"() {
      const ci = read(".github/workflows/ci.yml");
      if (!ci.includes("contents: read")) fail("workflow token is not read-only");
      if (ci.includes("pull_request_target")) fail("workflow uses pull_request_target");
      for (const name of manifest.requiredChecks) {
        if (!new RegExp(`^  ${name}:`, "m").test(ci)) fail(`workflow is missing job ${name}`);
      }
      for (const match of ci.matchAll(/uses:\s*(\S+)/g)) {
        const ref = match[1].split("@")[1] ?? "";
        if (!/^[0-9a-f]{40}$/.test(ref)) fail(`action is not pinned to a SHA: ${match[1]}`);
      }
    },
    "protected-paths"() {
      const owners = read(".github/CODEOWNERS");
      for (const path of manifest.protectedPaths) {
        if (!owners.includes(path)) fail(`CODEOWNERS missing ${path}`);
      }
    },
    "agent-charter"() {
      const agents = read("AGENTS.md");
      for (const phase of manifest.teamPhases) {
        if (!agents.includes(phase)) fail(`AGENTS.md does not name phase ${phase}`);
      }
      if (!agents.includes("founding/manifest.json")) fail("AGENTS.md does not point at the manifest");
    },
    "analytics-fixtures"() {
      const actual = sampleSummary();
      if (JSON.stringify(actual) !== JSON.stringify(fixtures.analytics)) {
        fail(`sample totals ${JSON.stringify(actual)} are not the fixtures`);
      }
      const sql = read("sql/orders_daily.sql");
      const table = `${manifest.aws.glueDatabase}.${manifest.aws.table}`;
      if (!sql.includes(`FROM ${table}`)) fail(`SQL does not read ${table}`);
      if (!sql.includes("paid_cents")) fail("SQL does not project paid_cents");
    },
    "private-lake"() {
      const tf = ["s3.tf", "athena.tf", "glue.tf", "iam.tf"].map((name) => read(`infra/terraform/${name}`)).join("\n");
      const needles = [
        "block_public_acls       = true",
        "restrict_public_buckets = true",
        'sse_algorithm = "AES256"',
        'encryption_option = "SSE_S3"',
        'name = "mere"',
      ];
      for (const item of needles) {
        if (!tf.includes(item)) fail(`terraform is missing ${item}`);
      }
      const install = read("scripts/install-terraform.sh");
      if (!install.includes(fixtures.terraformSha256)) fail("terraform checksum drifted from the fixtures");
      if (!install.includes(fixtures.terraformVersion)) fail("terraform version drifted from the fixtures");
    },
  };
  const ids = Object.keys(checks);
  for (const row of rubric) {
    if (!checks[row.id]) fail(`rubric row ${row.id} has no runner`);
  }
  for (const id of ids) {
    if (!rubric.some((row) => row.id === id)) fail(`runner ${id} is not in the rubric`);
  }
  for (const id of ids) checks[id]();
  const critical = rubric.filter((row) => row.critical).map((row) => row.id);
  if (critical.length === 0) fail("the rubric has no critical rows");
  return { failures, revision: manifest.revision, checks: ids.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const ran = runBedrock();
  if (ran.failures.length) {
    for (const failure of ran.failures) console.error(`bedrock: ${failure}`);
    process.exit(1);
  }
  console.log(`bedrock ok · revision ${ran.revision} · ${ran.checks} checks`);
}
