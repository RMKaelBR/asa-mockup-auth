import { DataSource, DataSourceOptions } from "typeorm";
import { User } from "./users/user.entity";
import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV}` });

// console.log(`Environment: ` + process.env.NODE_ENV);
// const dbUsername = process.env.DB_USERNAME;
// const dbPassword = process.env.DB_PASSWORD;
// const dbName = process.env.DB_NAME;
// const cookiekey = process.env.COOKIE_KEY;

// console.log('DB Username:', dbUsername);
// console.log('DB Password:', dbPassword);
// console.log('DB Name:', dbName);
// console.log('COOKIE_KEY:', cookiekey)

const dataSourceOptions : DataSourceOptions = process.env.NODE_ENV === 'production'
  ? {
      type: "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [User],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      synchronize: false,
      connectTimeoutMS: 30000,
      ssl: {
        rejectUnauthorized: false, // Accepts any SSL certificate (you can make it stricter based on your security requirements)
      },
    }
  : {
      type: 'sqlite',
      database: process.env.NODE_ENV === 'test' ? 'test.sqlite' : 'db.sqlite',
      entities: [User],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      synchronize: true,
    };

const SqlDataSource = new DataSource(dataSourceOptions)

export default SqlDataSource;