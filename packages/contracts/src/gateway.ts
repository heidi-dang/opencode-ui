import { z } from 'zod';

// ── Connection state ────────────────────────────────────────────────

export const GatewayConnectionViewSchema = z.enum([
  'offline',
  'connecting',
  'connected',
  'degraded',
  'reconnecting',
]);
export type GatewayConnectionView = z.infer<typeof GatewayConnectionViewSchema>;

// ── Session view model ──────────────────────────────────────────────

export const GatewaySessionStatusSchema = z.enum([
  'idle',
  'busy',
  'retrying',
  'attention',
  'error',
]);
export type GatewaySessionStatus = z.infer<typeof GatewaySessionStatusSchema>;

export const GatewaySessionViewSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: GatewaySessionStatusSchema,
  lastActivityLabel: z.string(),
  description: z.string().optional(),
  isDemo: z.boolean().optional(),
});
export type GatewaySessionView = z.infer<typeof GatewaySessionViewSchema>;

// ── Message view model ──────────────────────────────────────────────

export const GatewayMessageRoleSchema = z.enum([
  'user',
  'assistant',
  'tool',
  'system',
]);
export type GatewayMessageRole = z.infer<typeof GatewayMessageRoleSchema>;

export const GatewayMessageViewSchema = z.object({
  id: z.string(),
  role: GatewayMessageRoleSchema,
  content: z.string(),
  createdAtLabel: z.string(),
  isStreaming: z.boolean().optional(),
  isDemo: z.boolean().optional(),
});
export type GatewayMessageView = z.infer<typeof GatewayMessageViewSchema>;

// ── Permission prompt view model ────────────────────────────────────

export const GatewayPermissionRiskSchema = z.enum(['low', 'medium', 'high']);
export type GatewayPermissionRisk = z.infer<typeof GatewayPermissionRiskSchema>;

export const GatewayPermissionPromptViewSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  riskLevel: GatewayPermissionRiskSchema,
  requestedActionLabel: z.string(),
});
export type GatewayPermissionPromptView = z.infer<typeof GatewayPermissionPromptViewSchema>;

// ── Preview status view model ───────────────────────────────────────

export const GatewayPreviewStateSchema = z.enum([
  'not-configured',
  'starting',
  'ready',
  'error',
  'stopped',
]);
export type GatewayPreviewState = z.infer<typeof GatewayPreviewStateSchema>;

export const GatewayPreviewStatusViewSchema = z.object({
  state: GatewayPreviewStateSchema,
  label: z.string(),
  canStart: z.boolean(),
  canStop: z.boolean(),
});
export type GatewayPreviewStatusView = z.infer<typeof GatewayPreviewStatusViewSchema>;

// ── Workspace registry view model ───────────────────────────────────

export const GatewayWorkspaceEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  isDemo: z.boolean().optional(),
});
export type GatewayWorkspaceEntry = z.infer<typeof GatewayWorkspaceEntrySchema>;

export const GatewayBranchEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  isDemo: z.boolean().optional(),
});
export type GatewayBranchEntry = z.infer<typeof GatewayBranchEntrySchema>;

export const GatewayAgentEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  badge: z.string().optional(),
  isDemo: z.boolean().optional(),
});
export type GatewayAgentEntry = z.infer<typeof GatewayAgentEntrySchema>;

export const GatewayModelEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  badge: z.string().optional(),
  isDemo: z.boolean().optional(),
});
export type GatewayModelEntry = z.infer<typeof GatewayModelEntrySchema>;

export const GatewayWorkspaceRegistryViewSchema = z.object({
  workspaces: z.array(GatewayWorkspaceEntrySchema),
  branches: z.array(GatewayBranchEntrySchema),
  agents: z.array(GatewayAgentEntrySchema),
  models: z.array(GatewayModelEntrySchema),
  isDemo: z.boolean(),
});
export type GatewayWorkspaceRegistryView = z.infer<typeof GatewayWorkspaceRegistryViewSchema>;

// ── Aggregate status view model ─────────────────────────────────────

export const GatewayStatusViewSchema = z.object({
  connection: GatewayConnectionViewSchema,
  sessionCount: z.number(),
  gatewayVersion: z.string().optional(),
  isDemo: z.boolean(),
});
export type GatewayStatusView = z.infer<typeof GatewayStatusViewSchema>;

// ── Runtime config view model ───────────────────────────────────────

export const GatewayRunModeSchema = z.enum([
  'safe-disabled',
  'configured-not-connected',
  'configuration-error',
]);
export type GatewayRunMode = z.infer<typeof GatewayRunModeSchema>;

export const GatewayRuntimeConfigViewSchema = z.object({
  nodeEnv: z.enum(['development', 'test', 'production']),
  sdkEnabled: z.boolean(),
  serverConfigured: z.boolean(),
  modelConfigured: z.boolean(),
  mode: GatewayRunModeSchema,
});
export type GatewayRuntimeConfigView = z.infer<typeof GatewayRuntimeConfigViewSchema>;

// ── Adapter health view model ───────────────────────────────────────

export const GatewayAdapterHealthViewSchema = z.object({
  ok: z.boolean(),
  adapter: z.enum(['disabled', 'configured']),
  connection: z.enum(['not-enabled', 'not-connected']),
  sdkInstalled: z.literal(false),
  liveRequestsEnabled: z.literal(false),
  message: z.string(),
});
export type GatewayAdapterHealthView = z.infer<typeof GatewayAdapterHealthViewSchema>;
