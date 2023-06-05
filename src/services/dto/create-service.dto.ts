import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsCurrency, IsNotEmpty, IsString } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty()
  @IsString({ message: 'A categoria deve ser um texto' })
  @IsNotEmpty({ message: 'É necessário informar a categoria' })
  category: string;

  @ApiProperty()
  @IsCurrency({}, { message: 'É necessário informar um preço válido' })
  @IsNotEmpty({ message: 'É necessário informar o preço' })
  price: string;

  @ApiProperty()
  @IsBoolean({
    message: 'A disponibilidade de agendamento deve ser um boleano',
  })
  @IsNotEmpty({
    message: 'É necessário informar a disponibilidade de agendamento',
  })
  scheduling: boolean;

  @ApiProperty()
  @IsBoolean({ message: 'A prioridade de publicação deve ser um boleano' })
  @IsNotEmpty({ message: 'É necessário informar a prioridade de publicação' })
  priority: boolean;
}
