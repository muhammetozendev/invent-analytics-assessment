import { Request } from 'express';
import { validationResult } from 'express-validator';
import { ValidationException } from '../errors/validation-exception';

export function validateRequest(req: Request<any, any, any, any>) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array();
    console.log(errors);
    throw new ValidationException(errors);
  }
}
