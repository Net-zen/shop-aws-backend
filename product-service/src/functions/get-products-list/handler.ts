import 'source-map-support/register';

import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/apiGateway';
import {formatJSONResponse} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';

import schema from './schema';

import {Client} from 'pg';

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

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    const res = await client.query('select p.*, s.count\n' +
    'from products as p\n' +
    'left join stocks as s on p.id = s.product_id;'
  );

    console.log('products from db:', res.rows);

    return formatJSONResponse(200, res.rows);
  } catch (err) {
    console.error('Fail to get products from db ', err);

    return formatJSONResponse(500, {message: 'Fail to get products from db'})
  } finally {
    await client.end();
  }
}

export const main = middyfy(getProductsList);
