import 'source-map-support/register'

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'
import { formatJSONResponse } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'

import schema from './schema'

import * as AWS from 'aws-sdk'
import csvParser from 'csv-parser'
const BUCKET = 'store-import'

const importFileParser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('importFileParser, event: ', event)

  const s3 = new AWS.S3({region: 'eu-west-1'})
  const results = []
  const params = {
    Bucket: BUCKET,
    Prefix: 'uploaded/'
  }
  try {
    const s3response = await s3.listObjectsV2(params).promise()

    const content = s3response.Contents

    content.map(async (item) => {
      if (item.Size){
        const stream = await s3.getObject({
          Bucket: BUCKET,
          Key: item.Key
        })
        stream.createReadStream()
          .pipe(csvParser())
          .on('data', data => results.push(data))
          .on('end', async () => {
            console.log('product parsed from csv', results)
            await s3.copyObject({
              Bucket: BUCKET,
              CopySource: `${BUCKET}/${item.Key}`,
              Key: item.Key.replace('uploaded', 'parsed')
            }).promise()

            await s3.deleteObject({
              Bucket: BUCKET,
              Key: item.Key
            }).promise()
          })
      }
    })

    return formatJSONResponse(200)
  } catch (e) {
    return formatJSONResponse(500, {message: e.message})
  }
}

export const main = middyfy(importFileParser)
