import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME!;
if (!TABLE_NAME) throw new Error("Environment variable TABLE_NAME is not set");

export const handler = async (event: any) => {
  console.log("EVENT:", JSON.stringify(event, null, 2));

  const method = event.httpMethod;
  const id = event.pathParameters?.id
    ? decodeURIComponent(event.pathParameters.id)
    : null;

  let body = null;
  try {
    body = event.body ? JSON.parse(event.body) : null;
  } catch (err) {
    console.error("Failed to parse body:", err);
    return response(400, { message: "Invalid JSON body" });
  }

  console.log("METHOD:", method, "ID:", id, "BODY:", body);

  try {
    switch (method) {
      case "GET":
        if (id) {
          const result = await ddbDocClient.send(
            new GetCommand({ TableName: TABLE_NAME, Key: { id } })
          );
          return response(200, result.Item || {});
        } else {
          const result = await ddbDocClient.send(
            new ScanCommand({ TableName: TABLE_NAME })
          );
          return response(200, result.Items || []);
        }

      case "POST":
        if (!body?.title) {
          return response(400, { message: "Missing 'title' in request body" });
        }
        const newItem = {
          id: uuidv4(),
          title: body.title,
          completed: false,
        };
        await ddbDocClient.send(
          new PutCommand({ TableName: TABLE_NAME, Item: newItem })
        );
        return response(201, newItem);

      case "PUT":
        if (!id)
          return response(400, { message: "Missing path parameter 'id'" });
        if (!body?.title || typeof body.completed !== "boolean") {
          return response(400, {
            message: "Missing 'title' or 'completed' in body",
          });
        }
        const updated = await ddbDocClient.send(
          new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression: "set title = :t, completed = :c",
            ExpressionAttributeValues: {
              ":t": body.title,
              ":c": body.completed,
            },
            ReturnValues: "ALL_NEW",
          })
        );
        return response(200, updated.Attributes);

      case "DELETE":
        if (!id)
          return response(400, { message: "Missing path parameter 'id'" });
        await ddbDocClient.send(
          new DeleteCommand({ TableName: TABLE_NAME, Key: { id } })
        );
        return response(200, { message: "Deleted" });

      default:
        return response(400, { message: "Unsupported HTTP method" });
    }
  } catch (err: any) {
    console.error("LAMBDA ERROR:", err);
    return response(500, { error: err.message });
  }
};

const response = (statusCode: number, body: any) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
