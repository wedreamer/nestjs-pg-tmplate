import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import allEntity from './entity';
import configuration from 'src/config/configuration';

const config = configuration();
const { host, port, username, password, database } = config.db;

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host,
  port,
  username,
  password,
  database,
  synchronize: false,
  logging: false,
  entities: allEntity,
  migrations: [join(__dirname, './migrations/*.ts')],
  migrationsTableName: 'migrations',
  migrationsRun: true,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
