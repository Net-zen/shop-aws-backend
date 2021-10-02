import 'source-map-support/register'

import {formatJSONResponse} from '@libs/apiGateway'
import {middyfy} from '@libs/lambda'

import * as AWS from 'aws-sdk'
import {ProductService} from '../../services/product-service'

const catalogBatchProcess = async (event) => {
  console.log('catalogBatchProcess, event: ', event)

  const sns = new AWS.SNS()

  await ProductService.createClient()
  await ProductService.connect()

  try {
    const products = event.Records.map(({body}) => JSON.parse(body))

    await Promise.all(products.map(async (product) => await ProductService.createProduct(product)))

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
  } finally {
    await ProductService.disconnect()
  }
}

export const main = middyfy(catalogBatchProcess)
