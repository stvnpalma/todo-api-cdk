import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

export class CdkTodoApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ----------------------
    // DynamoDB Table
    // ----------------------
    const table = new dynamodb.Table(this, "TodosTable", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // ----------------------
    // Lambda Function
    // ----------------------
    const todosLambda = new NodejsFunction(this, "TodosLambda", {
      entry: path.join(__dirname, "../lambda/todos.ts"),
      handler: "handler",
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    // Grant Lambda read/write permissions to the table
    table.grantReadWriteData(todosLambda);

    // ----------------------
    // API Gateway
    // ----------------------
    const api = new apigateway.RestApi(this, "TodosApi", {
      restApiName: "Todo Service",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // /todos
    const todos = api.root.addResource("todos");
    todos.addMethod("GET", new apigateway.LambdaIntegration(todosLambda));
    todos.addMethod("POST", new apigateway.LambdaIntegration(todosLambda));

    // /todos/{id}
    const todo = todos.addResource("{id}");
    todo.addMethod("GET", new apigateway.LambdaIntegration(todosLambda));
    todo.addMethod("PUT", new apigateway.LambdaIntegration(todosLambda));
    todo.addMethod("DELETE", new apigateway.LambdaIntegration(todosLambda));
  }
}
