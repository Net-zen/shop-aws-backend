import {ProductService} from '../src/services/product-service'
import {main as catalogBatchProcess} from '../src/functions/catalog-batch-process/handler'
import * as AWS from 'aws-sdk-mock'

type Record = { body: string }

type snsEvent = { Records: Record[] }

const testProduct1 = {
  title: 'test product 1',
  description: 'test product 1 description',
  price: '1',
  image_url: 'test product 1 image url',
  count: 1
}

const testProduct2 = {
  title: 'test product 21',
  description: 'test product 2 description',
  price: '2',
  image_url: 'test product 2 image url',
  count: 2
}

const testProducts = [{body: JSON.stringify(testProduct1)},
                      {body: JSON.stringify(testProduct2)}]



jest.mock("../src/services/product-service")
const publishMock = jest.fn((params) => params)

describe('ProductService catalogBatchProcess', () => {
  beforeAll(() => {
    // @ts-ignore
    ProductService.createProduct.mockImplementation(() => true)
    AWS.mock('SNS', 'publish', (params, callback) => {
      callback(null, publishMock(params));
    })
  })

  test('should call createProduct twice', async () => {
    const event: snsEvent = {Records: testProducts}
    await catalogBatchProcess(event, undefined, undefined)
    expect(ProductService.createProduct).toBeCalledTimes(2)
  })

  test('should call createProduct with right test product 1', async () => {
    expect(ProductService.createProduct).toBeCalledWith(testProduct1)
  })

  test('should call createProduct with right test product 2', async () => {
    expect(ProductService.createProduct).toBeCalledWith(testProduct2)
  })

  test('should call sns.publish twice', async () => {
    expect(publishMock).toBeCalledTimes(2)
  })

  test('should call sns.publish with right test product 1', async () => {
    expect(publishMock)
      .toBeCalledWith({
        Message: JSON.stringify(testProduct1),
        "MessageAttributes": {
          "price": {
            "DataType": "Number",
              "StringValue": "1",
          },
        },
        "Subject": "Products added",
        "TopicArn": undefined,}
      )
  })

  test('should call sns.publish with right test product 2', async () => {
    expect(publishMock).
    toBeCalledWith({
      Message: JSON.stringify(testProduct2),
      "MessageAttributes": {
        "price": {
          "DataType": "Number",
          "StringValue": "2",
        },
      },
      "Subject": "Products added",
      "TopicArn": undefined,}
    )
  })

  test('should catch and log errors', async () => {
    console.log = jest.fn()

    const err = new Error('error')
    // @ts-ignore
    ProductService.createProduct.mockImplementation(() => {
      throw err
    })

    const event: snsEvent = {Records: testProducts}
    await catalogBatchProcess(event, undefined, undefined)


    // @ts-ignore
    expect(console.log.mock.calls[1][1]).toEqual(err)
  })
})
