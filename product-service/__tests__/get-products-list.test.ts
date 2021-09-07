import {APIGatewayProxyEvent} from "aws-lambda";
import { main as getProductsList } from '../src/functions/get-products-list/handler';

type result = {
  headers?: {},
  statusCode?: number,
  body?: string
}

describe('Status code', () => {
  test('check request respond correct status code', async () => {
      const event: APIGatewayProxyEvent = {} as any;
      const result: result = await getProductsList(event, undefined, undefined);
      expect(result.statusCode).toEqual(200 );
    })
});

describe('Items in products list correct', () => {
  test('check each item in product list has necessary properties  with correct types',
    async () => {
      const event: APIGatewayProxyEvent = {} as any
      const result: result = await getProductsList(event, undefined, undefined);
      const productsList = JSON.parse(result.body);

      productsList.forEach(product => {
        expect(product).toEqual({
          count: expect.any(Number),
          description: expect.any(String),
          id: expect.any(String),
          price: expect.any(Number),
          title: expect.any(String),
          imageUrl: expect.stringMatching(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&/=]*)/)
        })
      })
    })
});
