import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { removeMoneyFormatting, formatOnlyNumbers } from '../utils/format.util';

@Injectable()
export class RemoveFormattingPipe implements PipeTransform {
  private isArr(value: any): boolean {
    return Array.isArray(value);
  }

  private isObj(value: any): boolean {
    return typeof value === 'object' && value !== null;
  }

  private cpfFormatting(value: any) {
    if (value.cpf && typeof value.cpf === 'string')
      value.cpf = formatOnlyNumbers(value.cpf);
  }

  private phoneFormatting(value: any) {
    if (value.phone && typeof value.phone === 'string')
      value.phone = formatOnlyNumbers(value.phone);
  }

  private priceFormatting(value: any) {
    if (value.price && typeof value.price === 'string')
      value.price = removeMoneyFormatting(value.price);
  }

  private removeFormatting(value: any) {
    if (this.isArr(value)) return value;

    const newValue = { ...value };

    this.cpfFormatting(newValue);
    this.phoneFormatting(newValue);
    this.priceFormatting(newValue);

    return newValue;
  }

  transform(value: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    const applyTrim = this.isObj(value) && type === 'body';
    return applyTrim ? this.removeFormatting(value) : value;
  }
}
