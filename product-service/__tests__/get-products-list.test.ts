import {ProductService} from '../src/services/product-service'
import {main as getProductsList} from '../src/functions/get-products-list/handler'
import {APIGatewayProxyEvent} from 'aws-lambda'
// @ts-ignore
import db from './__mocks__/mocked-db.json'

type result = {
  headers?: {},
  statusCode?: number,
  body?: string
}

jest.mock("../src/services/product-service")


describe('ProductService getProductsList', () => {
  beforeAll( () => {
    // @ts-ignore
    ProductService.getAllProducts.mockImplementation(() => db)
  })

  test('should return status code 200', async () => {
    const event: APIGatewayProxyEvent = {} as any
    const result: result = await getProductsList(event, undefined, undefined)
    expect(result.statusCode).toEqual(200)
  })

  test('should return array of products each item in array has necessary properties with correct types', async () => {
    const event: APIGatewayProxyEvent = {} as any
    const result: result = await getProductsList(event, undefined, undefined)
    const productsList = JSON.parse(result.body)

    productsList.forEach(product => {
      expect(product).toEqual({
        count: expect.any(Number),
        description: expect.any(String),
        id: expect.any(String),
        price: expect.any(Number),
        title: expect.any(String),
        image_url: expect.stringMatching(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&/=]*)/)
      })
    })
  })
})


