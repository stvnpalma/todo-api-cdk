# 📚 Serverless Todo API - AWS CDK

## 📌 Overview

This repository contains the **Infrastructure as Code (IaC)** definition for a complete serverless Todo List API. The infrastructure is defined using the **AWS Cloud Development Kit (CDK)** with **TypeScript**.

### Architecture

The API provisions the following core AWS components:

- **Amazon API Gateway (REST API):** The public endpoint for the application.
- **AWS Lambda Functions (TypeScript):** Handles the business logic (Create, Read, Update, Delete) for Todo items.
- **Amazon DynamoDB:** A NoSQL table used to persistently store all Todo items.

## 🚀 Getting Started

### Prerequisites

1.  **Node.js and npm** (LTS version recommended)
2.  **AWS Account** configured with CLI access.
3.  **AWS CDK Toolkit** installed globally:
    ```bash
    npm install -g aws-cdk
    ```

### Installation

1.  Clone the repository:
    ```bash
    git clone [YOUR_REPO_URL]
    cd [YOUR_REPO_NAME]
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Compile the TypeScript code to JavaScript:
    ```bash
    npm run build
    ```

## ⚙️ Deployment

Before deployment, if this is your first time using CDK in your AWS account/region, you need to **bootstrap** it:

```bash
npx cdk bootstrap aws://[ACCOUNT_ID]/[REGION]
```

To deploy the entire stack to your configured AWS account and region:

```
npx cdk deploy
```

### Development Commands

The project uses standard CDK and TypeScript commands for development workflow:

```
Command,Description
npm run build,Compiles TypeScript code in lib/ and Lambda src/ directories to JavaScript.
npm run watch,Watches for file changes and compiles automatically.
npm run test,Runs Jest unit tests for the CDK stack and Lambda functions.
npx cdk diff,Compares the current local stack definition with the deployed stack.
npx cdk synth,Emits the synthesized CloudFormation template to the cdk.out directory.
npx cdk destroy,⚠️ WARNING: Destroys all deployed AWS resources for this stack.
```
