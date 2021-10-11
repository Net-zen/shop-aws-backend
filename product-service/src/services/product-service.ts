import {Client} from 'pg';

const {DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD} = process.env;

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

  static async getAllProducts() {
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

  static async createProduct(product) {
    const {title, description, price, image_url, count} = product;
    console.log('PRODUCT', product);

    try {
      await ProductService.client.query('begin');
      const res = await ProductService.client.query(`
          insert into products (title, description, price, image_url)
          values ('${title}', '${description}', ${price}, '${image_url}')
          RETURNING *`
      );
      const resCount = await ProductService.client.query(`
          insert into stocks (product_id, count)
          values ((select id from products where id = '${res.rows[0].id}'), ${count})
          returning count`
      );
      await ProductService.client.query('commit');
      return {...res.rows[0], ...resCount.rows[0]}
    } catch (err) {
      console.log('ERR',err);
      await ProductService.client.query('rollback');

      throw Error(err)
    }
  }
}

export {ProductService}
