import { ValueTransformer } from 'typeorm';
import Decimal from 'decimal.js';

export const decimalTransformer: ValueTransformer = {
  from(value?: string) {
    if (!value) {
      return null;
    }
    return new Decimal(value);
  },
  to(value?: Decimal) {
    if (!value) {
      return null;
    }
    return value.toString();
  },
};
