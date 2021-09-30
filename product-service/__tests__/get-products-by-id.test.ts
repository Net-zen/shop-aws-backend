import {ProductService} from '../src/services/product-service'
import {main as getProductsById} from '../src/functions/get-products-by-id/handler'
import {APIGatewayProxyEvent} from 'aws-lambda'
// @ts-ignore
import db from './__mocks__/mocked-db.json'

type result = {
  headers?: {},
  statusCode?: number,
  body?: string
}

jest.mock("../src/services/product-service")

describe('ProductService getProductsById', () => {
  beforeAll( () => {
    // @ts-ignore
    ProductService.getProduct.mockImplementation((id: string) => {
      const product = db.find(product => product.id === id)
      return [product]
    })
  })

  test('should return status code 200', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: {
        productId: 'd4e75f8a-40a2-40e0-bcb5-1e9a2dfb37c9'
      }
    } as any
    const result: result = await getProductsById(event, undefined, undefined)
    expect(result.statusCode).toEqual(200)
  })

  test('should return status code 404', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: {
        productId: 'd4e75f8a-40a2-40e0-bcb5-1e9a2dfb37c7'
      }
    } as any
    const result: result = await getProductsById(event, undefined, undefined)
    expect(result.statusCode).toEqual(404)
  })

  test('should return product with necessary properties with correct types', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: {
        productId: 'd4e75f8a-40a2-40e0-bcb5-1e9a2dfb37c9'
      }
    } as any
    const result: result = await getProductsById(event, undefined, undefined)
    const product = JSON.parse(result.body)

    expect(product).toEqual({
      count: expect.any(Number),
      description: expect.any(String),
      id: expect.any(String),
      price: expect.any(Number),
      title: expect.any(String),
      image_url: expect.stringMatching(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&/=]*)/)
    })
  })

  test('should return product with correct properties', async () => {
      const event: APIGatewayProxyEvent = {
        pathParameters: {
          productId: 'd4e75f8a-40a2-40e0-bcb5-1e9a2dfb37c9'
        }
      } as any
      const result: result = await getProductsById(event, undefined, undefined);
      const product = JSON.parse(result.body);

      expect(product).toEqual({
        count: 1,
        description: 'Atlanta Hawks Nike Association Swingman Jersey - Trae Young - Mens',
        id: 'd4e75f8a-40a2-40e0-bcb5-1e9a2dfb37c9',
        price: 107,
        title: 'Atlanta Hawks',
        image_url: "https://images-for-nba-jerseys-store.s3.eu-west-1.amazonaws.com/img/atlanta.webp"
      })
    })
})
