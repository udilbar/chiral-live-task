export type RunStatus = "QUEUED" | "RUNNING" | "SUCCEEDED" | "FAILED";

export type Run = {
  id: string;
  workflowName: string;
  status: RunStatus;
  /** ISO 8601 date string */
  startedAt: string;
  /** null while the run has not finished */
  durationMs: number | null;
};

export type RunsResponse = {
  runs: Run[];
};
