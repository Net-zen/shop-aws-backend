import 'source-map-support/register'

import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/apiGateway'
import {formatJSONResponse} from '@libs/apiGateway'
import {middyfy} from '@libs/lambda'

import schema from './schema'

import * as AWS from 'aws-sdk'

const catalogBatchProcess: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('catalogBatchProcess, event: ', event)

  const sns = new AWS.SNS()

  try {
    const products = event.Records.map(({body}) => body)
    console.log('!!!!!!!', JSON.parse(products));
    sns.publish({
      Subject: 'Products added',
      Message: JSON.stringify(products),
      TopicArn: process.env.SNS_ARN
    }, (err) => {
      if (err) {
        console.log('Error: ', err)
      } else {
        console.log('Send email with products: ', products);
      }
    })

    return formatJSONResponse(200, {message: 'Products added to db'})
  } catch (e) {
    return formatJSONResponse(500, {message: e.message})
  }
}

export const main = middyfy(catalogBatchProcess)
