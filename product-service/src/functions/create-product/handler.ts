import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

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
  console.log('createProduct, event: ', event);

  const client = new Client(dbOptions);
  await client.connect();

  const {title, description, price, image_url, count} = event.body;

  try {
    await client.query('begin');
    const res = await client.query(`
        insert into products (title, description, price, image_url)
        values ('${title}', '${description}', ${price}, '${image_url}')
        RETURNING *`
    );
    const resCount = await client.query(`
        insert into stocks (product_id, count)
        values ((select id from products where id = '${res.rows[0].id}'), ${count})
        returning count`
    );
    await client.query('commit');

    console.log('product, added to db: ', {...res.rows[0], ...resCount.rows[0]});

    return formatJSONResponse(200, {...res.rows[0], ...resCount.rows[0]});
  } catch (err) {
    console.error('Fail to add product to db ', err);

    await client.query('rollback');

    return formatJSONResponse(500, {message: 'Fail to add product to db'})
  } finally {
    await client.end();
  }
}

export const main = middyfy(createProduct);
