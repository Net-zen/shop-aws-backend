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

  test('should return status code 400', async () => {
    const emptyEvent: APIGatewayProxyEvent = {} as any
    const result: result = await importProductsFile(emptyEvent, undefined, undefined)
    expect(result.statusCode).toEqual(400)
  })

  test('should return status code 400', async () => {
    const emptyEvent: APIGatewayProxyEvent = {
      queryStringParameters: {}
    } as any
    const result: result = await importProductsFile(emptyEvent, undefined, undefined)
    expect(result.statusCode).toEqual(400)
  })

  test('should return valid signed url', async () => {
    const event: APIGatewayProxyEvent = {
      queryStringParameters: {
        name: 'test-file'
      }
    } as any
    const result: result = await importProductsFile(event, undefined, undefined)
    expect(result.body).toMatch(`https://${TEST_FILE}`)
  })

  test('should return status code 500', async () => {
    AWS.mock('S3', 'getSignedUrlPromise', () => {
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
