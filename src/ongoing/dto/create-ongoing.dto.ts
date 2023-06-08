import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOngoingDto {
  @ApiProperty()
  @IsString({ message: 'O id da solicitação de serviço deve ser um texto' })
  @IsNotEmpty({
    message: 'É necessário informar o id da solicitação de serviço',
  })
  orderId: string;
}
