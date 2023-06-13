import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePlanDto {
  @ApiProperty()
  @IsString({ message: 'A chave do plano deve ser um texto' })
  @IsNotEmpty({ message: 'É necessário informar a chave do plano' })
  key: string;
}
