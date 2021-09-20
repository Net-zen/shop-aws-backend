import 'source-map-support/register'

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'
import { formatJSONResponse } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'

import schema from './schema'

import * as AWS from 'aws-sdk'
const BUCKET = 'store-import'

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('importProductsFile, event: ', event)

  if (!event.hasOwnProperty('queryStringParameters')) {
    return formatJSONResponse(400, {
      message: 'Request must contain file name'
    })
  }

  if (!event.queryStringParameters.hasOwnProperty('name')) {
    return formatJSONResponse(400, {
      message: 'Request must contain file name'
    })
  }

  const fileName = event.queryStringParameters.name
  const catalogPath = `uploaded/${fileName}`
  const s3 = new AWS.S3({region: 'eu-west-1'})
  const params = {
    Bucket: BUCKET,
    Key: catalogPath,
    ContentType: 'text/csv'
  }
  try {
    const signedUrl = await s3.getSignedUrlPromise('putObject', params)

    return formatJSONResponse(200, signedUrl)
  } catch (e) {
    return formatJSONResponse(500, {message: e.message})
  }
}

export const main = middyfy(importProductsFile)
