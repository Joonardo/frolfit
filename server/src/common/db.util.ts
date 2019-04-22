import * as pg from 'pg-promise';

export const NULL = {
  toPostgres: (): null => null
};

export const pgp = pg();

export default pgp({
  host: 'database',
  port: 5432,
  database: 'frolfit',
  user: 'postgres',
});
