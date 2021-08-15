import Workspace from "../model/Workspace";
import database from "../../services/database";

const workspaceTable = "InstallWorkspace-FreeeAttendanceApp";

export const saveWorkspace = async (workspace: Workspace): Promise<void> => {
  try {
    await database
      .put({
        TableName: workspaceTable,
        Item: workspace,
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getWorkspace = async (
  teamId: string
): Promise<Workspace | undefined> => {
  const ret = await database
    .get({
      TableName: workspaceTable,
      Key: { teamId },
      ConsistentRead: true,
    })
    .promise();
  return ret.Item as Workspace | undefined;
};
