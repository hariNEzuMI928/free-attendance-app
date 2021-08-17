import AWS from "aws-sdk";
import DynamoDB from "aws-sdk/clients/dynamodb";

const offlineOptions: DynamoDB.Types.ClientConfiguration = {
  region: "localhost",
  endpoint: `http://localhost:8000`,
};

const onlineOptions: DynamoDB.Types.ClientConfiguration = {
  region: process.env.AWS_REGION,
  credentials: new AWS.SharedIniFileCredentials({
    profile: process.env.AWS_PROFILE,
  }),
};

const options =
  process.env.IS_LOCAL === "true" ? offlineOptions : onlineOptions;

export const database = new DynamoDB(options);
export const databaseClient = new DynamoDB.DocumentClient(options);
