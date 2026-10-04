// Fake API for the interview. Candidates do not need to change this file.
//
// GET /api/runs          -> { runs: Run[] }  (40 runs, 400 ms delay)
// GET /api/runs?fail=1   -> HTTP 500
//
// RUNNING runs finish over time (one about every 20 seconds after the server starts),
// so polling ("keep the RUNNING rows fresh") shows real changes.
import { NextResponse } from "next/server";
import type { Run, RunStatus } from "@/lib/types";

const WORKFLOWS = [
  "Protein folding",
  "Molecular docking",
  "Genome alignment",
  "Toxicity prediction",
  "Solubility screen",
  "Binding affinity",
  "Variant calling",
  "Mass spec analysis",
];

const serverStart = Date.now();

function baseRuns(): (Run & { finishAfterMs?: number; willFail?: boolean })[] {
  const runs: (Run & { finishAfterMs?: number; willFail?: boolean })[] = [];
  let runningIndex = 0;
  for (let i = 0; i < 40; i++) {
    // Fixed pattern so every candidate sees the same data.
    const pattern: RunStatus[] = ["SUCCEEDED", "SUCCEEDED", "RUNNING", "FAILED", "SUCCEEDED", "QUEUED", "RUNNING", "SUCCEEDED"];
    const status = pattern[i % pattern.length];
    const startedAt = new Date(serverStart - (40 - i) * 7 * 60_000).toISOString();
    const run: Run & { finishAfterMs?: number; willFail?: boolean } = {
      id: `run_${String(1000 + i)}`,
      workflowName: WORKFLOWS[i % WORKFLOWS.length],
      status,
      startedAt,
      durationMs: status === "SUCCEEDED" || status === "FAILED" ? 60_000 + ((i * 7919) % 900_000) : null,
    };
    if (status === "RUNNING") {
      runningIndex += 1;
      run.finishAfterMs = runningIndex * 20_000;
      run.willFail = runningIndex % 4 === 0;
    }
    runs.push(run);
  }
  return runs;
}

function currentRuns(): Run[] {
  const elapsed = Date.now() - serverStart;
  return baseRuns().map(({ finishAfterMs, willFail, ...run }) => {
    if (run.status === "RUNNING" && finishAfterMs !== undefined && elapsed > finishAfterMs) {
      return {
        ...run,
        status: willFail ? "FAILED" : "SUCCEEDED",
        durationMs: Date.now() - Date.parse(run.startedAt),
      };
    }
    return run;
  });
}

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (url.searchParams.get("fail") === "1") {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

  return NextResponse.json({ runs: currentRuns() });
}
