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
import { saveWorkspace, getWorkspace } from "./../shared/dao/workspace";
import { saveUser, getUser } from "./../shared/dao/user";

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: "free-attendance-app",
  scopes: scopes,
  installerOptions: {
    userScopes: userScopes,
  },
  installationStore: {
    storeInstallation: async (installation) => {
      try {
        if (installation?.team === undefined)
          throw new Error(
            "Failed saving installation data to installationStore"
          );

        const workspace = buildPutWorkspaceParams(installation);
        const user = buildPutUserParams(installation);

        await Promise.all([saveWorkspace(workspace), saveUser(user)]);
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    },
    fetchInstallation: async (installQuery) => {
      try {
        const teamId = installQuery?.teamId || "";
        const userId = installQuery?.userId || "";

        const workspace = await getWorkspace(teamId);
        if (!workspace) throw new Error("Failed to get workspace.");

        const user = await getUser(userId);
        if (!user) throw new Error("Failed to get user.");

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
