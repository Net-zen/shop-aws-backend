import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

import {ProductService} from '../../services/product-service'

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('createProduct, event: ', event);

  await ProductService.createClient()
  await ProductService.connect()

  try {

    const res = await ProductService.createProduct(event.body)

    console.log('product, added to db: ', {...res});

    return formatJSONResponse(200, {...res});
  } catch (err) {
    console.error('Fail to add product to db ', err);

    return formatJSONResponse(500, {message: 'Fail to add product to db'})
  } finally {

    await ProductService.disconnect()
  }
}

export const main = middyfy(createProduct);
