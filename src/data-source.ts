import { DataSource } from "typeorm";
import { User } from "./users/user.entity";

const SqlDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.NODE_ENV === 'test' ? 'test.sqlite' : 'db.sqlite',
  entities: [User],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
})

export default SqlDataSource;