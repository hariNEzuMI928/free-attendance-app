import { App, ExpressReceiver } from "@slack/bolt";

import { scopes } from "./../shared/model/Workspace";
import { scopes as userScopes } from "./../shared/model/User";
import { storeInstallation, fetchInstallation } from "./installationService";

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: "freee-attendance-app",
  scopes: scopes,
  installerOptions: {
    userScopes: userScopes,
  },
  installationStore: {
    storeInstallation: storeInstallation,
    fetchInstallation: fetchInstallation,
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
