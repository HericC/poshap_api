import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateStatusDto {
  @ApiProperty()
  @IsString({ message: 'A chave do status deve ser um texto' })
  @IsNotEmpty({ message: 'É necessário informar a chave do status' })
  key: string;
}
