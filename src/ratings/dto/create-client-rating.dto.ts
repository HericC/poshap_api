import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateClientRatingDto {
  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsInt({ message: 'A avaliação do cliente deve ser um número' })
  @Min(1, { message: 'A avaliação não deve ser inferior a 1' })
  @Max(5, { message: 'A avaliação não deve ser superior a 5' })
  @IsNotEmpty({ message: 'É necessário informar a avaliação do cliente' })
  rating: number;

  @ApiProperty()
  @IsString({ message: 'A nota do cliente deve ser um texto' })
  @IsNotEmpty({ message: 'É necessário informar a nota do cliente' })
  note: string;

  @ApiProperty()
  @IsString({ message: 'O id do avaliado deve ser um texto' })
  @IsNotEmpty({ message: 'É necessário informar o id do avaliado' })
  userId: string;
}
