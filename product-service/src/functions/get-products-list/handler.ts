import 'source-map-support/register'

import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/apiGateway'
import {formatJSONResponse} from '@libs/apiGateway'
import {middyfy} from '@libs/lambda'

import schema from './schema'

import { ProductService } from "../../services/product-service"


const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  console.log('getProductsList')

  await ProductService.createClient()
  await ProductService.connect()

  try {
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
