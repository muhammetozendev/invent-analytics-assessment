import { BaseException } from './base-exception';

export class BadRequestException extends BaseException {
  constructor(message: string) {
    super({
      status: 400,
      message,
      type: 'BadRequestException',
    });
  }
}
