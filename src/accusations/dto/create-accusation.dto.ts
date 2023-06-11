import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAccusationDto {
  @ApiProperty()
  @IsString({ message: 'A título deve ser um texto' })
  @IsNotEmpty({ message: 'É necessário informar o título' })
  title: string;

  @ApiProperty()
  @IsString({ message: 'A descrição deve ser um texto' })
  @IsNotEmpty({ message: 'É necessário informar a descrição' })
  description: string;

  @ApiProperty()
  @IsString({ message: 'O id do acusado deve ser um texto' })
  @IsNotEmpty({ message: 'É necessário informar o id do acusado' })
  accusedId: string;
}
