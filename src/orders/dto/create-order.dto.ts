import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsString({ message: 'O id do serviço deve ser um texto' })
  @IsNotEmpty({ message: 'É necessário informar o id do serviço' })
  serviceId: string;

  @ApiProperty()
  @IsDateString(
    { strict: true },
    { message: 'É necessário informar uma data de agendamento válido' },
  )
  @IsOptional({})
  schedulingDate: string;
}
