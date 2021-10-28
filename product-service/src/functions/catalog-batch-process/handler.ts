import 'source-map-support/register'

import {middyfy} from '@libs/lambda'

import * as AWS from 'aws-sdk'
import {ProductService} from '../../services/product-service'


type Record = { body: string }

type snsEvent = { Records: Record[] }

const catalogBatchProcess = async (event: snsEvent): Promise<void> => {
  console.log('catalogBatchProcess, event: ', event)

  const sns = new AWS.SNS()

  await ProductService.createClient()
  await ProductService.connect()

  try {
    const products = event.Records.map(({body}) => JSON.parse(body))

    await Promise.all(products.map((product) => ProductService.createProduct(product)))

    products.forEach(product => {
      sns.publish({
        Subject: 'Products added',
        Message: JSON.stringify(product),
        MessageAttributes: {
          "price": {
            DataType: "Number",
            StringValue: product.price
          }
        },
        TopicArn: process.env.SNS_ARN
      }, (err) => {
        if (err) {
          console.log('Error in sns: ', err)
        } else {
          console.log('Send email with products: ', product);
        }
      })
    })
  } catch (e) {
    console.log('Error: ', e)
  } finally {
    await ProductService.disconnect()
  }
}

export const main = middyfy(catalogBatchProcess)
