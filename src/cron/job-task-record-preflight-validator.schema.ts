export type CronJobTaskRecord = {
  id: string;
  title: string;
  status: string;
  assigned_to: string;
  priority: number;
  domain: string;
  project: string;
  source: string;
  context: string;
  next_action: string;
  created_at: string;
  updated_at: string;
  due_at?: string | null;
  deliverable?: string | null;
  blocker?: string | null;
  [key: string]: unknown;
};

// Single source of truth for the preflight validator.
export const cronJobTaskRecordRequiredFields = [
  "id",
  "title",
  "status",
  "assigned_to",
  "priority",
  "domain",
  "project",
  "source",
  "context",
  "next_action",
  "created_at",
  "updated_at",
] as const;

export const cronJobTaskRecordFieldTypes = {
  id: "string",
  title: "string",
  status: "string",
  assigned_to: "string",
  priority: "number",
  domain: "string",
  project: "string",
  source: "string",
  context: "string",
  next_action: "string",
  created_at: "string",
  updated_at: "string",
  due_at: "string|null",
  deliverable: "string|null",
  blocker: "string|null",
} as const satisfies Record<string, string>;

export type CronJobTaskRecordRequiredField = (typeof cronJobTaskRecordRequiredFields)[number];

export type CronJobTaskRecordFieldTypeMap = typeof cronJobTaskRecordFieldTypes;
