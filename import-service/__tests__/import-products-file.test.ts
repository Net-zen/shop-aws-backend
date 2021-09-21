import {main as importProductsFile} from '../src/functions/import-products-file/handler'
import * as AWS from 'aws-sdk-mock'
import { APIGatewayProxyEvent } from 'aws-lambda'

type result = {
  headers?: {},
  statusCode?: number,
  body?: string
}

const TEST_FILE = 'test-file'

describe('Import service importProductsFile', () => {

  beforeAll( async () => {
    AWS.mock('S3', 'getSignedUrl', `https://${TEST_FILE}`)
  })

  test('should return status code 200', async () => {
    const event: APIGatewayProxyEvent = {
      queryStringParameters: {
        name: 'test-file'
      }
    } as any
    const result: result = await importProductsFile(event, undefined, undefined)
    expect(result.statusCode).toEqual(200)
  })

  test('should return valid signed url', async () => {
    const event: APIGatewayProxyEvent = {
      queryStringParameters: {
        name: 'test-file'
      }
    } as any
    const result: result = await importProductsFile(event, undefined, undefined)
    expect(JSON.parse(result.body)).toEqual(`https://${TEST_FILE}`)
  })

  test('should return status code 500', async () => {
    AWS.restore('S3')
    AWS.mock('S3', 'getSignedUrl', () => {
      throw new Error('Server error')
    })
    const event: APIGatewayProxyEvent = {
      queryStringParameters: {
        name: 'test-file'
      }
    } as any
    const result: result = await importProductsFile(event, undefined, undefined)
    expect(result.statusCode).toEqual(500)
  })
})
