import { Installation, InstallationQuery } from "@slack/bolt";

import {
  buildPutWorkspaceParams,
  buildSlackInstallation,
} from "./../shared/model/Workspace";
import {
  buildPutUserParams,
  buildUserInstallation,
} from "./../shared/model/User";
import {
  getWorkspace,
  saveWorkspace,
  existsWorkspaceTable,
  createWorkspaceTable,
} from "./../shared/dao/workspace";
import {
  getUser,
  saveUser,
  createUserTable,
  existsUserTable,
} from "./../shared/dao/user";

export const storeInstallation = async (installation: Installation) => {
  try {
    if (installation?.team === undefined)
      throw new Error("Failed saving installation data to installationStore");

    if (!(await existsUserTable())) await createUserTable();
    if (!(await existsWorkspaceTable())) await createWorkspaceTable();

    const workspace = buildPutWorkspaceParams(installation);
    const user = buildPutUserParams(installation);

    await Promise.all([saveWorkspace(workspace), saveUser(user)]);
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

export const fetchInstallation = async (
  installQuery: InstallationQuery<boolean>
) => {
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
};
