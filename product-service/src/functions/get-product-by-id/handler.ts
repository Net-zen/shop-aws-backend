import 'source-map-support/register';

import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/apiGateway';
import {formatJSONResponse} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';

import schema from './schema';

import productList from './productList.json';

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const id = event.pathParameters.productId;
  const product = productList.find(product => product.id === id);
  if (!product) {
    return formatJSONResponse( 404, {
      message: 'Product not found'
    });
  }
  return formatJSONResponse(200, {product});
}

export const main = middyfy(getProductById);
