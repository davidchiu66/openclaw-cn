import type {
  ChannelMeta,
  ChannelPlugin,
  OpenClawConfig as ClawdbotConfig,
} from "openclaw/plugin-sdk";
import { dingtalkConnectorOnboardingAdapter } from "./onboarding.js";

const CHANNEL_ID = "dingtalk-connector";

const meta: ChannelMeta = {
  id: CHANNEL_ID,
  label: "钉钉",
  selectionLabel: "钉钉 (官方连接器)",
  docsPath: "/channels/dingtalk-connector",
  docsLabel: "dingtalk-connector",
  blurb: "钉钉机器人集成，通过官方 dingtalk-connector 接入。",
  aliases: ["dingtalk", "dingding"],
  order: 40,
};

type DingtalkConnectorAccount = {
  accountId: string;
  enabled: boolean;
  configured: boolean;
  clientId?: string;
};

export const dingtalkConnectorPlugin: ChannelPlugin<DingtalkConnectorAccount> = {
  id: CHANNEL_ID,
  meta,
  capabilities: {
    chatTypes: ["direct", "channel"],
    polls: false,
    threads: false,
    media: false,
    nativeCommands: false,
    reactions: false,
    edit: false,
    reply: false,
  },
  reload: { configPrefixes: [`channels.${CHANNEL_ID}`] },
  configSchema: {
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        enabled: { type: "boolean" },
        clientId: { type: "string" },
        clientSecret: { type: "string" },
        gatewayToken: { type: "string" },
        gatewayPassword: { type: "string" },
        sessionTimeout: { type: "integer", minimum: 0 },
      },
      required: [],
    },
  },
  config: {
    listAccountIds: (cfg) => {
      const channelCfg = (cfg.channels as Record<string, unknown> | undefined)?.[CHANNEL_ID];
      return channelCfg ? ["default"] : [];
    },
    resolveAccount: (cfg, accountId) => {
      const channelCfg = (cfg.channels as Record<string, unknown> | undefined)?.[CHANNEL_ID] as
        | Record<string, unknown>
        | undefined;
      const clientId = (channelCfg?.clientId as string | undefined) ?? "";
      return {
        accountId: accountId ?? "default",
        enabled: channelCfg?.enabled !== false && Boolean(channelCfg),
        configured: Boolean(channelCfg?.clientId && channelCfg?.clientSecret),
        clientId: clientId || undefined,
      };
    },
    defaultAccountId: () => "default",
    setAccountEnabled: ({ cfg, enabled }) => {
      const next = { ...cfg } as ClawdbotConfig;
      const channels = { ...(next.channels as Record<string, unknown> | undefined) };
      const existing = (channels[CHANNEL_ID] as Record<string, unknown> | undefined) ?? {};
      channels[CHANNEL_ID] = { ...existing, enabled };
      next.channels = channels as ClawdbotConfig["channels"];
      return next;
    },
    deleteAccount: ({ cfg }) => {
      const next = { ...cfg } as ClawdbotConfig;
      const channels = { ...(next.channels as Record<string, unknown> | undefined) };
      delete channels[CHANNEL_ID];
      next.channels = channels as ClawdbotConfig["channels"];
      return next;
    },
    isConfigured: (account) => account.configured,
    describeAccount: (account) => ({
      accountId: account.accountId,
      enabled: account.enabled,
      configured: account.configured,
      clientId: account.clientId,
    }),
    resolveAllowFrom: () => [],
    formatAllowFrom: ({ allowFrom }) => allowFrom.map((e) => String(e).trim()).filter(Boolean),
  },
  setup: {
    resolveAccountId: () => "default",
    applyAccountConfig: ({ cfg }) => {
      const next = { ...cfg } as ClawdbotConfig;
      const channels = { ...(next.channels as Record<string, unknown> | undefined) };
      const existing = (channels[CHANNEL_ID] as Record<string, unknown> | undefined) ?? {};
      channels[CHANNEL_ID] = { ...existing, enabled: true };
      next.channels = channels as ClawdbotConfig["channels"];
      return next;
    },
  },
  onboarding: dingtalkConnectorOnboardingAdapter,
  status: {
    defaultRuntime: {
      accountId: "default",
      running: false,
      lastStartAt: null,
      lastStopAt: null,
      lastError: null,
      port: null,
    },
    buildChannelSummary: ({ snapshot }) => ({
      configured: snapshot.configured ?? false,
      running: snapshot.running ?? false,
      lastStartAt: snapshot.lastStartAt ?? null,
      lastStopAt: snapshot.lastStopAt ?? null,
      lastError: snapshot.lastError ?? null,
      port: snapshot.port ?? null,
      probe: snapshot.probe,
      lastProbeAt: snapshot.lastProbeAt ?? null,
    }),
    buildAccountSnapshot: ({ account, runtime }) => ({
      accountId: account.accountId,
      enabled: account.enabled,
      configured: account.configured,
      running: runtime?.running ?? false,
      lastStartAt: runtime?.lastStartAt ?? null,
      lastStopAt: runtime?.lastStopAt ?? null,
      lastError: runtime?.lastError ?? null,
      port: runtime?.port ?? null,
    }),
  },
};
