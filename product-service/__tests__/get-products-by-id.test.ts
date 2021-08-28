import {APIGatewayProxyEvent} from "aws-lambda";
import { main as getProductsById } from '../src/functions/get-products-by-id/handler';

describe('Status code', () => {
  test('check request respond correct status code', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: {
        productId: '123abc'
      }
    } as any;
    const result = await getProductsById(event);
    expect(result.statusCode).toEqual(404);
  })
});

describe('Status code', () => {
  test('check request respond correct status code', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: {
        productId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa'
      }
    } as any;
    const result = await getProductsById(event);
    expect(result.statusCode).toEqual(200);
  })
});


describe('Items in products list correct', () => {
  test('check each item in product list has necessary properties  with correct types',
    async () => {
      const event: APIGatewayProxyEvent = {
        pathParameters: {
          productId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa'
        }
      } as any
      const result = await getProductsById(event);
      const product = JSON.parse(result.body);

      expect(product).toEqual({
        count: expect.any(Number),
        description: expect.any(String),
        id: expect.any(String),
        price: expect.any(Number),
        title: expect.any(String)
      })
    })
});

describe('Items in products list correct', () => {
  test('check each item in product list has necessary properties  with correct types',
    async () => {
      const event: APIGatewayProxyEvent = {
        pathParameters: {
          productId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa'
        }
      } as any
      const result = await getProductsById(event);
      const product = JSON.parse(result.body);

      expect(product).toEqual({
        count: 4,
        description: 'Short Product Description1',
        id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
        price: 2.4,
        title: 'ProductOne'
      })
    })
});
