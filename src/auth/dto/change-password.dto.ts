import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { OtgCodeDto } from './otg-code.dto';

export class ChangePasswordDto extends OtgCodeDto {
  @ApiProperty({ minimum: 8 })
  @IsString({ message: 'A senha deve ser um texto' })
  @MinLength(8, { message: 'A senha deve possuir ao menos 8 characteres' })
  @IsNotEmpty({ message: 'É necessário informar a senha' })
  password: string;
}
