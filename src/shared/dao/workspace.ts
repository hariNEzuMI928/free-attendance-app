import Workspace from "../model/Workspace";
import { database, databaseClient } from "../../services/database";

const workspaceTable = "freee-attendance-app_Workspaces";

export const saveWorkspace = async (workspace: Workspace): Promise<void> => {
  try {
    await databaseClient
      .put({ TableName: workspaceTable, Item: workspace })
      .promise();
  } catch (error) {
    throw error;
  }
};

export const getWorkspace = async (
  teamId: string
): Promise<Workspace | undefined> => {
  const ret = await databaseClient
    .get({ TableName: workspaceTable, Key: { teamId }, ConsistentRead: true })
    .promise();
  return ret.Item as Workspace | undefined;
};

export const createWorkspaceTable = async (): Promise<void> => {
  const params = {
    TableName: workspaceTable,
    AttributeDefinitions: [{ AttributeName: "teamId", AttributeType: "S" }],
    KeySchema: [{ AttributeName: "teamId", KeyType: "HASH" }],
    ProvisionedThroughput: { ReadCapacityUnits: 10, WriteCapacityUnits: 10 },
  };

  await database.createTable(params).promise();
};

export const existsWorkspaceTable = async (): Promise<boolean | undefined> => {
  const params = { Limit: 10 };
  const res = await database.listTables(params).promise();
  return res?.TableNames?.some((tableName) => tableName === workspaceTable);
};
