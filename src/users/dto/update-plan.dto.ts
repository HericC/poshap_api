import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export enum TypePlan {
  monthly = 'monthly',
  quarterly = 'quarterly',
  semester = 'semester',
}

export enum TypePayment {
  wallet = 'wallet',
  bankSlip = 'bankSlip',
}

export class UpdatePlanDto {
  @ApiProperty()
  @IsString({ message: 'A chave do plano deve ser um texto' })
  @IsNotEmpty({ message: 'É necessário informar a chave do plano' })
  key: string;

  @ApiProperty({
    description: 'Tipo do plano',
    enum: TypePlan,
  })
  @IsNotEmpty({ message: 'É necessário informar o tipo do plano' })
  typePlan: TypePlan;

  @ApiProperty({
    description: 'Tipo de pagamento',
    enum: TypePayment,
  })
  @IsNotEmpty({ message: 'É necessário informar o tipo de pagamento' })
  typePayment: TypePayment;
}
