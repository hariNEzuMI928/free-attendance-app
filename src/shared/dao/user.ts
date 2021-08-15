import User from "../model/User";
import database from "../../services/database";

const userTable = "InstallUser-FreeeAttendanceApp";

export const saveUser = async (user: User): Promise<void> => {
  try {
    await database
      .put({
        TableName: userTable,
        Item: user,
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUser = async (
  teamId: string,
): Promise<User | undefined> => {
  const ret = await database
    .get({
      TableName: userTable,
      Key: { teamId },
      ConsistentRead: true,
    })
    .promise();

  return ret.Item as User | undefined;
};
