/**
 * Gateway event contracts — defines the shape of SSE events
 * that the gateway will emit to the frontend in a future phase.
 *
 * Phase 2A: Contract-only. No SSE implementation exists.
 */

/** Event types the gateway may emit to the frontend via SSE. */
export type GatewayEventType =
  | 'session.updated'
  | 'message.created'
  | 'message.streaming'
  | 'connection.state'
  | 'permission.requested'
  | 'preview.status'
  | 'workspace.updated';
