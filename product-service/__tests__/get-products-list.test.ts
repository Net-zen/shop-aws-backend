import {APIGatewayProxyEvent} from "aws-lambda";
import { main as getProductsList } from '../src/functions/get-products-list/handler';

describe('Status code', () => {
  test('check request respond correct status code', async () => {
      const event: APIGatewayProxyEvent = {} as any;
      const result = await getProductsList(event);
      expect(result.statusCode).toEqual(200 );
    })
});

describe('Items in products list correct', () => {
  test('check each item in product list has necessary properties  with correct types',
    async () => {
      const event: APIGatewayProxyEvent = {} as any
      const result = await getProductsList(event);
      const productsList = JSON.parse(result.body);

      productsList.forEach(product => {
        expect(product).toEqual({
          count: expect.any(Number),
          description: expect.any(String),
          id: expect.any(String),
          price: expect.any(Number),
          title: expect.any(String)
        })
      })
    })
});
