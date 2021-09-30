import 'source-map-support/register';

import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/apiGateway';
import {formatJSONResponse} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';

import schema from './schema';

import { ProductService } from "../../services/product-service"

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('getProductsById, event: ', event);

  const id = event.pathParameters.productId;

  const uuidv4 = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  const isValidProductId = uuidv4.test(id);

  if (!isValidProductId) {
    console.error(`Product id ${id} is not valid`);

    return formatJSONResponse(400, {message: `Product id ${id} is not valid`})
  }

  await ProductService.createClient()
  await ProductService.connect()


  try {
    const res = await ProductService.getProduct(id)

    if (!res[0]) {
      console.error(`product with id ${id}:  not found`);

      return formatJSONResponse(404, {
        message: `Product with id ${id} not found`
      });
    }

    console.log(`product with id ${id}: `, res[0]);

    return formatJSONResponse(200, res[0]);
  } catch (err) {
    console.error('Fail to get product from db ', err);

    return formatJSONResponse(500, {message: 'Fail to get products from db'})
  } finally {
    await ProductService.disconnect()
  }
}

export const main = middyfy(getProductsById);
