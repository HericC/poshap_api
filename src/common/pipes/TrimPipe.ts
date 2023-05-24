import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  private isArr(value: any): boolean {
    return Array.isArray(value);
  }

  private isObj(value: any): boolean {
    return typeof value === 'object' && value !== null;
  }

  private isStr(value: any): boolean {
    return typeof value === 'string';
  }

  private removeSpaces(str: string): string {
    return str.trim().replace(/\s{2,}/g, ' ');
  }

  private trimArray(value: any[]) {
    const newValue: any[] = [];

    value.forEach((key: any) => {
      if (this.isStr(key)) newValue.push(this.removeSpaces(key));
      else if (this.isObj(key)) newValue.push(this.trim(key));
      else newValue.push(key);
    });

    return newValue;
  }

  private trimObject(value: any) {
    const newValue: any = {};

    Object.keys(value).forEach((key) => {
      if (key === 'password') newValue[key] = value[key];
      else if (this.isStr(value[key]))
        newValue[key] = this.removeSpaces(value[key]);
      else if (this.isObj(value[key])) newValue[key] = this.trim(value[key]);
      else newValue[key] = value[key];
    });

    return newValue;
  }

  private trim(value: any) {
    return this.isArr(value) ? this.trimArray(value) : this.trimObject(value);
  }

  transform(value: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    const applyTrim = this.isObj(value) && type === 'body';
    return applyTrim ? this.trim(value) : value;
  }
}
