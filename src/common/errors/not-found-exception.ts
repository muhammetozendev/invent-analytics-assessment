import { BaseException } from './base-exception';

export class NotFoundException extends BaseException {
  message: string;

  constructor(message: string) {
    super({
      status: 404,
      message,
      type: NotFoundException.name,
    });
    this.message = message;
  }
}
