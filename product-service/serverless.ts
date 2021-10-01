import type { AWS } from '@serverless/typescript';

import { getProductsList, getProductsById, createProduct, catalogBatchProcess } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  package: {
    individually: true
  },
  frameworkVersion: '2',
  useDotenv: true,
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: "eu-west-1",
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: {
          'Ref': 'SNSTopic'
        },
      },
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      DB_HOST: '${env:DB_HOST}',
      DB_PORT: '${env:DB_PORT}',
      DB_DATABASE: '${env:DB_DATABASE}',
      DB_USERNAME: '${env:DB_USERNAME}',
      DB_PASSWORD: '${env:DB_PASSWORD}',
      SNS_ARN: {
        Ref: 'SNSTopic'
      },
    },
    lambdaHashingVersion: '20201221',
  },
  resources: {
    Resources: {
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic',
        }
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: '${env:EMAIL}',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic'
          },
        }
      }
    }
  },
  // import the function via paths
  functions: { getProductsList, getProductsById, createProduct, catalogBatchProcess },
};

module.exports = serverlessConfiguration;
