import { Installation } from "@slack/bolt";

export const scopes = [
  "chat:write",
  "chat:write.public",
  "chat:write.customize",
];

export type Scopes = typeof scopes[number];

export default interface Workspace {
  teamId: string;
  tenantId: string;
  name: string | undefined;
  appId: string;
  botId: string;
  botUserId: string;
  token: string;
  scopes: Scopes[];
}

export const buildPutWorkspaceParams = (
  installation: Installation
): Workspace => {
  const teamId = installation.team?.id;
  if (!teamId) throw new Error("Not support Org installation!");

  return {
    teamId,
    tenantId: installation.team?.id || "",
    name: installation.team?.name,
    appId: installation.appId || "",
    botId: installation.bot?.id || "",
    botUserId: installation.bot?.userId || "",
    token: installation.bot?.token || "",
    scopes: installation.bot?.scopes || [],
  };
};

export const buildSlackInstallation = (
  workspace: Workspace
): Installation<"v2", false> => {
  return {
    team: { id: workspace.teamId, name: workspace.name },
    enterprise: undefined,
    appId: workspace.appId,
    user: { id: "", token: "", scopes: [] },
    bot: {
      scopes: workspace.scopes,
      token: workspace.token,
      userId: workspace.botUserId,
      id: workspace.botId,
    },
    tokenType: "bot",
  };
};
