import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export enum TypePayment {
  bankSlip = 'bankSlip',
}

export class UpdateWalletDto {
  @ApiProperty({ minimum: 5 })
  @IsNumber({}, { message: 'O valor deve ser um número' })
  @IsNotEmpty({ message: 'É necessário informar o valor' })
  @Min(5, { message: 'Valor mínimo 5 reais' })
  value: number;

  @ApiProperty({
    description: 'Tipo de pagamento',
    enum: TypePayment,
  })
  @IsNotEmpty()
  typePayment: TypePayment;
}
