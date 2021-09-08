import 'source-map-support/register';

import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/apiGateway';
import {formatJSONResponse} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';

import schema from './schema';

import { Client } from 'pg';

const {DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD} = process.env;
const dbOptions = {
  host: DB_HOST,
  port: DB_PORT,
  database: DB_DATABASE,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000
};

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const client = new Client(dbOptions);
  await client.connect();

  const { title, description, price, image_url, count } = event.body;

  try {
    const res = await client.query(`WITH product as (
        insert into products (title, description, price, image_url) values
            ('${title}', '${description}', ${price}, '${image_url}') RETURNING *
        )
        insert into stocks (product_id, count) values
            ((select id from product), ${count}) returning product_id`);

    console.log('products from db:', res.rows[0].product_id);

    return formatJSONResponse(200, {id: res.rows[0].product_id, ...event.body});
  } catch (err) {
    console.error('Fail to add product to db ', err);

    return formatJSONResponse(500, {message: 'Fail to add product to db'})
  } finally {
    await client.end();
  }
}

export const main = middyfy(createProduct);
