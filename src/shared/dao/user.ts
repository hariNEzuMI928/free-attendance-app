import User from "../model/User";
import { database, databaseClient } from "../../services/database";

const userTable = "freee-attendance-app_Users";

export const saveUser = async (user: User): Promise<void> => {
  try {
    await databaseClient.put({ TableName: userTable, Item: user }).promise();
  } catch (error) {
    throw error;
  }
};

export const getUser = async (userId: string): Promise<User | undefined> => {
  const ret = await databaseClient
    .get({ TableName: userTable, Key: { userId }, ConsistentRead: true })
    .promise();

  return ret.Item as User | undefined;
};

export const createUserTable = async (): Promise<void> => {
  const params = {
    TableName: userTable,
    AttributeDefinitions: [{ AttributeName: "userId", AttributeType: "S" }],
    KeySchema: [{ AttributeName: "userId", KeyType: "HASH" }],
    ProvisionedThroughput: { ReadCapacityUnits: 10, WriteCapacityUnits: 10 },
  };

  await database.createTable(params).promise();
};

export const existsUserTable = async (): Promise<boolean | undefined>  => {
  const params = { Limit: 10 };
  const res = await database.listTables(params).promise();
  return res?.TableNames?.some((tableName) => tableName === userTable);
};
