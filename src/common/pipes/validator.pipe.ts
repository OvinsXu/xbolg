import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    //console.log(value);
    const object = plainToInstance(metatype, value, {
      excludeExtraneousValues: true, //去掉后端规定数据之外的数据
    });

    const errors = await validate(object); //验证数据类型

    if (errors.length > 0) {
      throw new BadRequestException('前端传递参数类型错误');
    }
    if (
      Object.getOwnPropertyNames(object).length !=
      Object.getOwnPropertyNames(value).length
    ) {
      throw new BadRequestException('前端传递了多余的参数');
    }
    return object;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
