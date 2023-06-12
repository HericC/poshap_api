import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty()
  @IsString({ message: 'A categoria deve ser um texto' })
  @IsNotEmpty({ message: 'É necessário informar a categoria' })
  category: string;

  @ApiProperty({ minimum: 1 })
  @IsNumber({}, { message: 'O preço deve ser um número' })
  @IsNotEmpty({ message: 'É necessário informar o preço' })
  @Min(1, { message: 'Preço mínimo 1 real' })
  price: number;

  @ApiProperty()
  @IsString({ message: 'A descrição deve ser um texto' })
  @IsOptional()
  description: string;

  @ApiProperty({ default: false })
  @IsBoolean({
    message: 'A disponibilidade de agendamento deve ser um boleano',
  })
  @IsOptional()
  scheduling: boolean;

  @ApiProperty({ default: false })
  @IsBoolean({ message: 'A prioridade de publicação deve ser um boleano' })
  @IsOptional()
  priority: boolean;
}
