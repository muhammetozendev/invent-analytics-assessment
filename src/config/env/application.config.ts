import { validateEnvironment } from '../../common/utils/validate-env';

export enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export const applicationConfig = {
  port:
    (validateEnvironment('PORT', {
      isNumber: true,
      isOptional: true,
    }) as number) || 3000,

  environment: validateEnvironment('NODE_ENV', {
    isEnum: Environment,
  }) as Environment,
};
