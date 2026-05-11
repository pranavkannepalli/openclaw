import { resolveAgentIdFromSessionKey } from "../../routing/session-key.js";
import { readSqliteSessionDeliveryContext } from "./session-entries.sqlite.js";

export function extractDeliveryInfo(sessionKey: string | undefined): {
  deliveryContext:
    | { channel?: string; to?: string; accountId?: string; threadId?: string }
    | undefined;
  threadId: string | undefined;
} {
  if (!sessionKey) {
    return { deliveryContext: undefined, threadId: undefined };
  }

  let deliveryContext:
    | { channel?: string; to?: string; accountId?: string; threadId?: string }
    | undefined;
  try {
    const agentId = resolveAgentIdFromSessionKey(sessionKey);
    deliveryContext = readSqliteSessionDeliveryContext({ agentId, sessionKey });
  } catch {
    // ignore: best-effort
  }
  return {
    deliveryContext,
    threadId: deliveryContext?.threadId,
  };
}
