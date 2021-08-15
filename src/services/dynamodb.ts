import DynamoDB from "aws-sdk/clients/dynamodb";

const offlineOptions: DynamoDB.Types.ClientConfiguration = {
  region: "localhost",
  endpoint: `http://localhost:8000`,
};

const dynamodb = new DynamoDB(offlineOptions);
const documentClient = new DynamoDB.DocumentClient(offlineOptions);

export default {
  raw: dynamodb,
  doc: documentClient,
};
