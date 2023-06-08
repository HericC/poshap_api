import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class FilterServiceDto {
  @ApiProperty({ required: false, description: 'Pesquisa' })
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({ required: false, description: 'Preço' })
  @IsNumberString()
  @IsOptional()
  minPrice: string;

  @ApiProperty({ required: false, description: 'Preço' })
  @IsNumberString()
  @IsOptional()
  maxPrice: string;

  @ApiProperty({ required: false, description: 'Tempo de espera' })
  @IsNumberString()
  @IsOptional()
  minWaiting: string;

  @ApiProperty({ required: false, description: 'Tempo de espera' })
  @IsNumberString()
  @IsOptional()
  maxWaiting: string;

  @ApiProperty({ required: false, description: 'Distancia' })
  @IsNumberString()
  @IsOptional()
  minDistance: string;

  @ApiProperty({ required: false, description: 'Distancia' })
  @IsNumberString()
  @IsOptional()
  maxDistance: string;

  @ApiProperty({ required: false, description: 'Avaliação' })
  @IsNumberString()
  @IsOptional()
  rating: string;

  @ApiProperty({ required: false, description: 'Categoria' })
  @IsString({ each: true })
  @IsOptional()
  categories: string[];
}
