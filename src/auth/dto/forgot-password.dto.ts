import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty()
  @IsEmail({}, { message: 'É necessário informar um e-mail válido' })
  @IsNotEmpty({ message: 'É necessário informar o e-mail' })
  email: string;
}
