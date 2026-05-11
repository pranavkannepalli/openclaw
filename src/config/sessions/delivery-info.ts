import { resolveAgentIdFromSessionKey } from "../../routing/session-key.js";
import { readSqliteSessionDeliveryContext } from "./session-entries.sqlite.js";
import { parseSessionThreadInfo } from "./thread-info.js";
export { parseSessionThreadInfo } from "./thread-info.js";

export function extractDeliveryInfo(sessionKey: string | undefined): {
  deliveryContext:
    | { channel?: string; to?: string; accountId?: string; threadId?: string }
    | undefined;
  threadId: string | undefined;
} {
  const { baseSessionKey, threadId } = parseSessionThreadInfo(sessionKey);
  if (!sessionKey || !baseSessionKey) {
    return { deliveryContext: undefined, threadId };
  }

  let deliveryContext:
    | { channel?: string; to?: string; accountId?: string; threadId?: string }
    | undefined;
  try {
    const agentId = resolveAgentIdFromSessionKey(sessionKey);
    deliveryContext =
      readSqliteSessionDeliveryContext({ agentId, sessionKey }) ??
      (baseSessionKey !== sessionKey
        ? readSqliteSessionDeliveryContext({ agentId, sessionKey: baseSessionKey })
        : undefined);
  } catch {
    // ignore: best-effort
  }
  return {
    deliveryContext,
    threadId: threadId !== undefined ? (deliveryContext?.threadId ?? threadId) : undefined,
  };
}
