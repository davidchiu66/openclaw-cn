// Browser-safe copy of src/gateway/protocol/client-info.ts
// Keep in sync with the source file when modifying.

export const GATEWAY_CLIENT_IDS = {
  WEBCHAT_UI: "webchat-ui",
  CONTROL_UI: "clawdbot-control-ui",
  WEBCHAT: "webchat",
  CLI: "cli",
  GATEWAY_CLIENT: "gateway-client",
  MACOS_APP: "clawdbot-macos",
  IOS_APP: "clawdbot-ios",
  ANDROID_APP: "clawdbot-android",
  NODE_HOST: "node-host",
  TEST: "test",
  FINGERPRINT: "fingerprint",
  PROBE: "clawdbot-probe",
} as const;

export type GatewayClientId = (typeof GATEWAY_CLIENT_IDS)[keyof typeof GATEWAY_CLIENT_IDS];

// Back-compat naming (internal): these values are IDs, not display names.
export const GATEWAY_CLIENT_NAMES = GATEWAY_CLIENT_IDS;
export type GatewayClientName = GatewayClientId;

export const GATEWAY_CLIENT_MODES = {
  WEBCHAT: "webchat",
  CLI: "cli",
  UI: "ui",
  BACKEND: "backend",
  NODE: "node",
  PROBE: "probe",
  TEST: "test",
} as const;

export type GatewayClientMode = (typeof GATEWAY_CLIENT_MODES)[keyof typeof GATEWAY_CLIENT_MODES];

export type GatewayClientInfo = {
  id: GatewayClientId;
  displayName?: string;
  version: string;
  platform: string;
  deviceFamily?: string;
  modelIdentifier?: string;
  mode: GatewayClientMode;
  instanceId?: string;
};
