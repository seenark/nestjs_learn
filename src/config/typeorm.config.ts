import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import * as config from 'config';

const dbConfig = config.get('db');
const serverConfig = config.get('server');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.HOST || dbConfig.host,
  port: process.env.PORT || dbConfig.port,
  username: process.env.DB_USERNAME || dbConfig.username,
  password: process.env.DB_PASSWORD || dbConfig.password,
  database: process.env.DB_DATABASE || dbConfig.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};

console.log('TypeORM start configuring');
console.log(serverConfig);
console.log(typeOrmConfig);
