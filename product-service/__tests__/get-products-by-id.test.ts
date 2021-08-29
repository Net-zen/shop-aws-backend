import {APIGatewayProxyEvent} from "aws-lambda";
import { main as getProductsById } from '../src/functions/get-products-by-id/handler';

type result = {
  headers?: {},
  statusCode?: number,
  body?: string
}

describe('Status code', () => {
  test('check request respond correct status code', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: {
        productId: '123abc'
      }
    } as any;
    const result: result = await getProductsById(event, undefined, undefined);
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
    const result: result = await getProductsById(event, undefined, undefined);
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
      const result: result = await getProductsById(event, undefined, undefined);
      const product = JSON.parse(result.body);

      expect(product).toEqual({
        count: expect.any(Number),
        description: expect.any(String),
        id: expect.any(String),
        price: expect.any(Number),
        title: expect.any(String),
        imageUrl: expect.stringMatching(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&/=]*)/)
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
      const result: result = await getProductsById(event, undefined, undefined);
      const product = JSON.parse(result.body);

      expect(product).toEqual({
        count: 1,
        description: 'Atlanta Hawks Nike Association Swingman Jersey - Trae Young - Mens',
        id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
        price: 107,
        title: 'Atlanta Hawks',
        "imageUrl": "https://images-for-nba-jerseys-store.s3.eu-west-1.amazonaws.com/img/atlanta.webp"
      })
    })
});
