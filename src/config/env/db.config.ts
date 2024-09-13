import { validateEnvironment } from '../../common/utils/validate-env';

export const dbConfig = {
  host: validateEnvironment('DB_HOST') as string,
  port: validateEnvironment('DB_PORT', { isNumber: true }) as number,
  username: validateEnvironment('DB_USERNAME') as string,
  password: validateEnvironment('DB_PASSWORD') as string,
  database: validateEnvironment('DB_DATABASE') as string,
};
