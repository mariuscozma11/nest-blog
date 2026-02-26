import { DataSource, DataSourceOptions } from 'typeorm';

function parseDbUrl(url: string): {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
} {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parseInt(parsed.port || '5432', 10),
    username: parsed.username,
    password: parsed.password,
    database: parsed.pathname.slice(1),
  };
}

function getDataSourceOptions(): DataSourceOptions {
  const databaseUrl = process.env['DATABASE_URL'];

  if (databaseUrl) {
    const dbConfig = parseDbUrl(databaseUrl);
    return {
      type: 'postgres',
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      synchronize: false,
      ssl:
        process.env['NODE_ENV'] === 'production'
          ? { rejectUnauthorized: false }
          : false,
    };
  }

  return {
    type: 'postgres',
    host: process.env['DB_HOST'] ?? 'localhost',
    port: parseInt(process.env['DB_PORT'] ?? '5432', 10),
    username: process.env['DB_USERNAME'] ?? 'postgres',
    password: process.env['DB_PASSWORD'] ?? 'postgres',
    database: process.env['DB_DATABASE'] ?? 'nest_blog',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: false,
  };
}

export const dataSourceOptions: DataSourceOptions = getDataSourceOptions();

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
