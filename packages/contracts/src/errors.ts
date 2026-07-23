/**
 * Gateway error contracts — safe error shapes returned by gateway endpoints.
 *
 * Phase 2A: Contract-only. Errors are scaffold-safe JSON responses.
 */

/** Standard gateway error response body. */
export interface GatewayErrorResponse {
  readonly ok: false;
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly requestId?: string;
  };
}
