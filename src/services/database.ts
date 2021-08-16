import DynamoDB from "aws-sdk/clients/dynamodb";

const offlineOptions: DynamoDB.Types.ClientConfiguration = {
  region: "localhost",
  endpoint: `http://localhost:8000`,
};


export const database = new DynamoDB(offlineOptions);
export const databaseClient = new DynamoDB.DocumentClient(offlineOptions);
