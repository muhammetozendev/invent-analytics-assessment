import { ValidationError } from 'express-validator';
import { BaseException } from './base-exception';

export class ValidationException extends BaseException {
  errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super({
      message: 'Validation error occured',
      status: 400,
      type: ValidationException.name,
    });
    this.errors = errors;
  }
}
