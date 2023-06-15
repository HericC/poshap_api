import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  MinLength,
  Validate,
} from 'class-validator';
import { IsCpf } from '../../common/validations/is-cpf.validation';

export class CreateUserDto {
  @ApiProperty()
  @IsString({ message: 'O nome deve ser um texto' })
  @IsNotEmpty({ message: 'É necessário informar o nome.' })
  name: string;

  @ApiProperty()
  @Validate(IsCpf, { message: 'É necessário informar um CPF válido' })
  @IsNotEmpty({ message: 'É necessário informar o cpf.' })
  cpf: string;

  @ApiProperty()
  @IsEmail({}, { message: 'É necessário informar um e-mail válido' })
  @IsNotEmpty({ message: 'É necessário informar o e-mail.' })
  email: string;

  @ApiProperty()
  @IsPhoneNumber('BR', { message: 'É necessário informar um telefone válido' })
  @IsNotEmpty({ message: 'É necessário informar o telefone.' })
  phone: string;

  @ApiProperty({ minimum: 8 })
  @IsString({ message: 'A senha deve ser um texto' })
  @MinLength(8, { message: 'A senha deve possuir ao menos 8 characteres' })
  @IsNotEmpty({ message: 'É necessário informar a senha.' })
  password: string;
}
