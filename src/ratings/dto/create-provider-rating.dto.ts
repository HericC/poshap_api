import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateProviderRatingDto {
  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsInt({ message: 'A avaliação do prestador deve ser um número' })
  @Min(1, { message: 'A avaliação do prestador não deve ser inferior a 1' })
  @Max(5, { message: 'A avaliação do prestador não deve ser superior a 5' })
  @IsNotEmpty({ message: 'É necessário informar a avaliação do prestador' })
  providerRating: number;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsInt({ message: 'A avaliação do serviço deve ser um número' })
  @Min(1, { message: 'A avaliação do serviço não deve ser inferior a 1' })
  @Max(5, { message: 'A avaliação do serviço não deve ser superior a 5' })
  @IsNotEmpty({ message: 'É necessário informar a avaliação do serviço' })
  serviceRating: number;

  @ApiProperty()
  @IsString({ message: 'A nota do prestador deve ser um texto' })
  @IsNotEmpty({ message: 'É necessário informar a nota do prestador' })
  providerNote: string;

  @ApiProperty()
  @IsString({ message: 'A nota do serviço deve ser um texto' })
  @IsNotEmpty({ message: 'É necessário informar a nota do serviço' })
  serviceNote: string;

  @ApiProperty()
  @IsString({ message: 'O id do avaliado deve ser um texto' })
  @IsNotEmpty({ message: 'É necessário informar o id do avaliado' })
  userId: string;
}
