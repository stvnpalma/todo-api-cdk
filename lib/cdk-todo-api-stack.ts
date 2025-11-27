import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export class CdkTodoApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Lambda function
    const todosLambda = new lambda.Function(this, "TodosLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "todos.handler",
      code: lambda.Code.fromAsset("lambda"),
    });

    // Create API Gateway REST API
    const api = new apigateway.RestApi(this, "TodosApi", {
      restApiName: "Todo Service",
    });

    // Add resource and GET method
    const todos = api.root.addResource("todos");
    todos.addMethod("GET", new apigateway.LambdaIntegration(todosLambda));
  }
}
