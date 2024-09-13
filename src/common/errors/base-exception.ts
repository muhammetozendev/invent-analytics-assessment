export interface BaseExceptionArgs {
  status: number;
  message: string;
  type: string;
}

export class BaseException extends Error {
  status: number;
  message: string;
  type: string;

  constructor(args: BaseExceptionArgs) {
    super(args.message);
    this.status = args.status;
    this.message = args.message;
    this.type = args.type;
  }
}
