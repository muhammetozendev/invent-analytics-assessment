export function validateEnvironment(
  key: string,
  validations: {
    isNumber?: boolean;
    isEnum?: any;
    isOptional?: boolean;
  } = {}
) {
  const value = process.env[key];

  if (!value && validations.isOptional) {
    return undefined;
  }

  if (!value) {
    throw new Error(`Environment variable '${key}' is missing`);
  }

  if (validations.isNumber) {
    if (isNaN(Number(value))) {
      throw new Error(`Invalid number for environment variable '${key}'`);
    }
    return Number(value);
  }

  if (validations.isEnum) {
    if (!Object.values(validations.isEnum).includes(value))
      throw new Error(
        `Invalid value for environment variable '${key}'. Possible values: ${Object.values(
          validations.isEnum
        ).join(', ')}`
      );

    return value;
  }

  return value;
}
