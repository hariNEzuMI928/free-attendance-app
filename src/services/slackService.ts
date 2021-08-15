import { App, ExpressReceiver, Installation } from "@slack/bolt";

import {
  scopes,
  buildPutWorkspaceParams,
  buildSlackInstallation,
} from "./../shared/model/Workspace";
import {
  scopes as userScopes,
  buildPutUserParams,
  buildUserInstallation,
} from "./../shared/model/User";
import { putWorkspace, getWorkspaceByKey } from "./../shared/dao/workspace";
import { putUser, getUserByKey } from "./../shared/dao/user";

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: "free-attendance-app",
  scopes: ["chat:write", "chat:write.public", "chat:write.customize"],
  installerOptions: {
    userScopes: ["users.profile:read", "users.profile:write"],
  },
  installationStore: {
    storeInstallation: async (installation) => {
      try {
        const tenantId = installation?.team?.id || "";
        const sub = installation.user.id;
        const workspace = buildPutWorkspaceParams({
          tenantId,
          installation,
        });
        const user = buildPutUserParams({ tenantId, sub, installation });
        await Promise.all([putWorkspace(workspace), putUser(user)]);
        return Promise.resolve();
      } catch (error) {
        console.error(error);
      }
    },
    fetchInstallation: async (installQuery) => {
      try {
        const tenantId = installQuery?.teamId || "";
        const workspace = await getWorkspaceByKey(tenantId);
        const user = await getUserByKey(tenantId, installQuery.userId || "");

        if (!workspace) throw new Error("Failed to get workspace!");
        if (!user) throw new Error("Failed to get user!");

        const workspaceInstallation = buildSlackInstallation(workspace);
        const userInstallation = buildUserInstallation(user);
        const installation: Installation<"v2", false> = {
          ...workspaceInstallation,
          user: userInstallation,
        };
        return Promise.resolve(installation);
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
});

const app = new App({ receiver: receiver });

receiver.router.get("/slack/user_install", async (_req, res) => {
  try {
    const url = await receiver.installer?.generateInstallUrl({
      scopes,
      userScopes,
      metadata: JSON.stringify({
        tenantId: "tenant-id",
        state: "sessionState",
      }),
    });

    res.send(buildSlackUrl(url || ""));
  } catch (error) {
    console.error(error);
  }
});

receiver.router.get("/slack/oauth_redirect", async (req, res) => {
  try {
    receiver.installer?.handleCallback(req, res);
  } catch (error) {
    console.log(error);
  }
});

function buildSlackUrl(url: string): string {
  return `<a href=${url}><img alt=""Add to Slack"" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>`;
}

export default app;
