import 'source-map-support/register';

import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/apiGateway';
import {formatJSONResponse} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';

import schema from './schema';

import { ProductService } from "../../services/product-service"

// import {Client} from 'pg';
// import {ProductService as realProductService} from "../../services/product-service";
// import {mockedProductService} from '../../../__tests__/services/mocked-product-service'

// const ProductService = process.env.NODE_ENV === 'test' ? mockedProductService
//                                                        : realProductService

// const {DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD} = process.env;
// const dbOptions = {
//   host: DB_HOST,
//   port: DB_PORT,
//   database: DB_DATABASE,
//   user: DB_USERNAME,
//   password: DB_PASSWORD,
//   ssl: {
//     rejectUnauthorized: false
//   },
//   connectionTimeoutMillis: 5000
// };

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('getProductsById, event: ', event);

  const id = event.pathParameters.productId;

  const uuidv4 = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  const isValidProductId = uuidv4.test(id);

  if (!isValidProductId) {
    console.error(`Product id ${id} is not valid`);

    return formatJSONResponse(400, {message: `Product id ${id} is not valid`})
  }
  /* istanbul ignore next */
  // const client = new Client(dbOptions);
  // await client.connect();

  await ProductService.createClient()
  await ProductService.connect()


  try {
    /* istanbul ignore next */
    // const res = await client.query(`
    //     select p.*, s.count
    //     from products as p
    //     left join stocks as s on p.id = s.product_id
    //     where p.id = '${id}'`
    // );

    const res = await ProductService.getProduct(id)

    // if (!res.rows[0]) {
    if (!res[0]) {
      console.error(`product with id ${id}:  not found`);

      return formatJSONResponse(404, {
        message: `Product with id ${id} not found`
      });
    }

    // console.log(`product with id ${id}: `, res.rows);
    console.log(`product with id ${id}: `, res[0]);

    // return formatJSONResponse(200, res.rows);
    return formatJSONResponse(200, res[0]);
  } catch (err) {
    console.error('Fail to get product from db ', err);

    return formatJSONResponse(500, {message: 'Fail to get products from db'})
  } finally {
    // await client.end();
    await ProductService.disconnect()
  }
}

export const main = middyfy(getProductsById);
