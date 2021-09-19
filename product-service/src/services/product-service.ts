import {Client} from 'pg';

const {DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD} = process.env;
// const dbOptions = {
//   host: DB_HOST,
//   port: parseInt(DB_PORT),
//   database: DB_DATABASE,
//   user: DB_USERNAME,
//   password: DB_PASSWORD,
//   ssl: {
//     rejectUnauthorized: false
//   },
//   connectionTimeoutMillis: 5000
// };

class ProductService {
  static dbOptions = {
    host: DB_HOST,
    port: parseInt(DB_PORT),
    database: DB_DATABASE,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 5000
  }

  static client = null

  static async createClient() {
    ProductService.client = new Client(ProductService.dbOptions)
  }

  static async connect() {
    await ProductService.client.connect()
  }

  static async disconnect() {
    await ProductService.client.end()
  }

  static async getAllProducts()  {
    const res = await ProductService.client.query(`
        select p.*, s.count
        from products as p
        left join stocks as s on p.id = s.product_id`
    )
    return res.rows
  }

  static async getProduct(id: string) {
    const res = await ProductService.client.query(`
        select p.*, s.count
        from products as p
        left join stocks as s on p.id = s.product_id
        where p.id = '${id}'`
    )
    return res.rows
  }
}

export { ProductService }
