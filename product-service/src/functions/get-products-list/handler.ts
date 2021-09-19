import 'source-map-support/register'

import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/apiGateway'
import {formatJSONResponse} from '@libs/apiGateway'
import {middyfy} from '@libs/lambda'

import schema from './schema'

import { ProductService } from "../../services/product-service"

// import {Client} from 'pg'
// import {ProductService as realProductService} from "../../services/product-service"
// import {mockedProductService} from '../../../__tests__/services/mocked-product-service'
//
// const ProductService = process.env.NODE_ENV === 'test' ? mockedProductService
//                                                        : realProductService

// const {DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD} = process.env
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
// }

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  console.log('getProductsList')

  // const client = new Client(dbOptions)
  // await client.connect()

  await ProductService.createClient()
  await ProductService.connect()

  try {
    /* istanbul ignore next */
    // const res = await client.query(`
    //     select p.*, s.count
    //     from products as p
    //     left join stocks as s on p.id = s.product_id`
    // )

    const res = await ProductService.getAllProducts()

    console.log('products from db:', res)

    return formatJSONResponse(200, res)
  } catch (err) {
    console.error('Fail to get products from db ', err)

    return formatJSONResponse(500, {message: 'Fail to get products from db'})
  } finally {
    await ProductService.disconnect()
  }
}

export const main = middyfy(getProductsList)
